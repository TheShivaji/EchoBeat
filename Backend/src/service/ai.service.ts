import config from "../config/config.js";
import { prisma } from "../config/db.js";

// ─── Private Helpers ─────────────────────────────────────────────────────────

/**
 * Shared HTTP client for all AI microservice calls.
 * Pass `authToken` when the Python agent needs it to call back secured Node routes.
 */
const callAIService = async (
    endpoint: string,
    payload: any,
    authToken?: string,
    timeoutMs: number = 60000 // Default 60 seconds
): Promise<any> => {
    const body = typeof payload === "string" ? { message: payload } : payload;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

    const response = await fetch(`${config.aiServiceUrl}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
        const error = new Error(
            `AI service request failed with status: ${response.status}`
        );

        Object.assign(error, { status: response.status });
        throw error;
    }

    return response.json();
};

const clampLimit = (value: unknown, defaultVal = 10, max = 30): number => {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 1) return defaultVal;
    return Math.min(n, max);
};

/**
 * DRY helper — get the primary artist display name from a song record.
 */
const getPrimaryArtist = (song: {
    artists?: { name: string }[];
}): string => song.artists?.[0]?.name ?? "Unknown Artist";

interface FetchSongsOptions {
    artist?: string;
    category?: string;
    limit: number;
}

interface FetchSongsResult {
    songs: any[];
    source: string;
}

const include = { artists: true, album: true } as const;

const fetchSongsWithFallback = async ({
    artist,
    category,
    limit,
}: FetchSongsOptions): Promise<FetchSongsResult> => {
    let songs: any[] = [];
    let source = "General Fallback";

    if (artist) {
        const artistRecord = await prisma.artist.findFirst({
            where: {
                name: { contains: artist, mode: "insensitive" },
                isDeleted: false,
            },
        });

        if (!artistRecord) {
            if (category) {
                songs = await prisma.song.findMany({
                    where: {
                        category: { contains: category, mode: "insensitive" },
                        artists: { none: { isDeleted: true } },
                        isDeleted: false,
                    },
                    take: limit,
                    include,
                });
                if (songs.length > 0) source = "Category Fallback";
            }
        } else {
            if (category) {
                songs = await prisma.song.findMany({
                    where: {
                        artists: { some: { id: artistRecord.id, isDeleted: false } },
                        category: { contains: category, mode: "insensitive" },
                        isDeleted: false,
                    },
                    take: limit,
                    include,
                });
                if (songs.length > 0) source = "Artist + Category";
            }

            if (songs.length === 0) {
                songs = await prisma.song.findMany({
                    where: {
                        artists: { some: { id: artistRecord.id, isDeleted: false } },
                        isDeleted: false,
                    },
                    take: limit,
                    include,
                });
                if (songs.length > 0) source = "Artist Fallback";
            }
        }
    }

    if (songs.length === 0 && category) {
        songs = await prisma.song.findMany({
            where: {
                category: { contains: category, mode: "insensitive" },
                artists: { none: { isDeleted: true } },
                isDeleted: false,
            },
            take: limit,
            include,
        });
        if (songs.length > 0) source = "Category";
    }

    if (songs.length === 0 && !artist && !category) {
        songs = await prisma.song.findMany({
            where: {
                isDeleted: false,
                artists: { none: { isDeleted: true } },
            },
            take: limit,
            include,
        });
        if (songs.length > 0) source = "General Fallback";
    }

    return { songs, source };
};

/**
 * DRY helper — fetch a single song with its artists, and validate it exists.
 * Returns `null` if not found.
 */
const fetchSongWithArtists = async (songId: string) => {
    return prisma.song.findUnique({
        where: { id: songId, isDeleted: false },
        include: {
            artists: {
                where: { isDeleted: false },
                select: { name: true },
            },
        },
    });
};

// ─── Public Service Functions ─────────────────────────────────────────────────

export const understandMusicRequest = async (message: string) => {
    try {
        return await callAIService("/ai/understand", message);
    } catch (error) {
        console.error("AI service connection error:", error);
        throw error;
    }
};

export const getAIRecommendations = async (message: string) => {
    const result = await understandMusicRequest(message);
    const { artist, category } = result;
    const limit = clampLimit(result.limit);

    return fetchSongsWithFallback({ artist, category, limit });
};

export const playlistGenrating = async (message: string) => {
    try {
        return await callAIService("/ai/playlist", message);
    } catch (error) {
        console.error("AI playlist service connection error:", error);
        throw error;
    }
};

export const generateAIPlaylist = async (message: string) => {
    try {
        const result = await playlistGenrating(message);
        const { playlist_name, artist, category, limit: requestedLimit } = result;
        const limit = clampLimit(requestedLimit, 3);

        const { songs, source } = await fetchSongsWithFallback({ artist, category, limit });

        if (songs.length === 0) {
            return {
                success: false,
                message: "No songs found for this playlist request",
                playlistName: playlist_name,
                songs: [],
            };
        }

        return { success: true, playlistName: playlist_name, source, songs };
    } catch (error) {
        console.error("Playlist recommendation error:", error);
        throw error;
    }
};

export const createAIPlaylistForUser = async (message: string, userId: string) => {
    const aiResult = await playlistGenrating(message);
    const { playlist_name, artist, category, limit: requestedLimit } = aiResult;
    const limit = clampLimit(requestedLimit, 5);

    const { songs, source } = await fetchSongsWithFallback({ artist, category, limit });

    if (songs.length === 0) {
        throw new Error("No matching songs found for this playlist request.");
    }

    const playlistName = playlist_name?.trim() || "AI Generated Playlist";

    const playlist = await prisma.$transaction(async (tx: any) => {
        return tx.playlist.create({
            data: {
                name: playlistName,
                description: `AI-generated playlist for: "${message}"`,
                isPublic: false,
                imageUrl: "",
                userId,
                songs: { connect: songs.map((s) => ({ id: s.id })) },
            },
            include: {
                songs: { include: { artists: true, album: true } },
            },
        });
    });

    return { playlist, source };
};

interface LyricsServiceOptions {
    songId: string;
    prompt?: string | undefined;
    action?: string | undefined;
    targetLanguage?: string | undefined;
}

export const getAILyricsExplanation = async ({
    songId,
    prompt,
    action = "explain",
    targetLanguage = "Hindi",
}: LyricsServiceOptions) => {
    // 1. Fetch authoritative song record from PostgreSQL (shared helper)
    const song = await fetchSongWithArtists(songId);

    if (!song) {
        return {
            success: false,
            error: "SONG_NOT_FOUND",
            message: "Song not found or has been removed.",
        };
    }

    const artist = getPrimaryArtist(song); // ← DRY: single call

    // 2. Strict non-hallucination check: if no lyrics, do not call LLM
    if (!song.lyrics || !song.lyrics.trim()) {
        return {
            success: true,
            lyricsAvailable: false,
            song: { id: song.id, title: song.title, artist },
            message: "Lyrics are not available for this song yet.",
        };
    }

    // 3. Call FastAPI with authoritative lyrics
    const aiResult = await callAIService("/ai/lyrics", {
        title: song.title,
        artist: song.artists?.[0]?.name ?? null,
        lyrics: song.lyrics,
        prompt: prompt || null,
        action: action || null,
        target_language: targetLanguage || null,
    });

    return {
        success: true,
        lyricsAvailable: true,
        song: { id: song.id, title: song.title, artist, originalLyrics: song.lyrics },
        result: aiResult,
    };
};

interface AssistantOptions {
    message: string;
    userId?: string;
    userContext?: {
        liked_songs: { id: string; title: string; artist: string; category: string | null }[];
        playlists: { id: string; name: string; description: string | null }[];
        recent_played: { id: string; title: string; artist: string; category: string | null }[];
    };
}

/**
 * Echo Agent — natural-language music assistant.
 * Node.js pre-fetches user data (liked songs, playlists, recent played)
 * and passes it as user_context so Python tools work without auth issues.
 */
export const callChatbotAssistant = async ({
    message,
    userId,
    userContext,
}: AssistantOptions) => {
    try {
        return await callAIService(
            "/ai/assistant",
            { message, user_id: userId, user_context: userContext },
            undefined,
            70000 // 70 seconds timeout (to safely cover Python's 60+ sec logic)
        );
    } catch (error: any) {
        if (
            error.name === "AbortError" ||
            error.name === "TimeoutError" ||
            error.status === 504
        ) {
            throw new Error("AI service timeout. Please try again.");
        }
    }
};
