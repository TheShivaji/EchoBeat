import config from "../config/config.js";
import { prisma } from "../config/db.js";

// ─── Private Helpers ─────────────────────────────────────────────────────────

/**
 * Shared HTTP client for all AI microservice calls.
 */
const callAIService = async (endpoint: string, payload: any): Promise<any> => {
    const body = typeof payload === "string" ? { message: payload } : payload;
    const response = await fetch(`${config.aiServiceUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`AI service request failed with status: ${response.status}`);
    }

    return response.json();
};


const clampLimit = (value: unknown, defaultVal = 10, max = 30): number => {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 1) return defaultVal;
    return Math.min(n, max);
};

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

        return {
            success: true,
            playlistName: playlist_name,
            source,
            songs,
        };
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

    const playlist = await prisma.$transaction(async (tx) => {
        return tx.playlist.create({
            data: {
                name: playlistName,
                description: `AI-generated playlist for: "${message}"`,
                isPublic: false,
                imageUrl: "",
                userId,
                songs: {
                    connect: songs.map((s) => ({ id: s.id })),
                },
            },
            include: {
                songs: {
                    include: { artists: true, album: true },
                },
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
    // 1. Fetch authoritative song record from PostgreSQL
    const song = await prisma.song.findUnique({
        where: { id: songId, isDeleted: false },
        include: {
            artists: {
                where: { isDeleted: false },
                select: { name: true },
            },
        },
    });

    if (!song) {
        return {
            success: false,
            error: "SONG_NOT_FOUND",
            message: "Song not found or has been removed.",
        };
    }

    // 2. Strict non-hallucination check: if no lyrics, do not call LLM
    if (!song.lyrics || !song.lyrics.trim()) {
        return {
            success: true,
            lyricsAvailable: false,
            song: {
                id: song.id,
                title: song.title,
                artist: song.artists?.[0]?.name ?? "Unknown Artist",
            },
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
        song: {
            id: song.id,
            title: song.title,
            artist: song.artists?.[0]?.name ?? "Unknown Artist",
            originalLyrics: song.lyrics,
        },
        result: aiResult,
    };
};

