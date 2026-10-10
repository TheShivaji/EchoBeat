import type { Request, Response } from "express";
import { understandMusicRequest, createAIPlaylistForUser, getAILyricsExplanation, callChatbotAssistant } from "../service/ai.service.js";
import { getUserLikedSongs, getUserPlaylists, getUserRecentlyPlayed } from "../service/user.service.js";
import { prisma } from "../config/db.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const understandMusic = asyncHandler(async (req: Request, res: Response) => {
    const { message } = req.body;

    if (!message) throw new AppError("Message is required", 400);

    const result = await understandMusicRequest(message);
    console.log(result)

    const { artist, category, limit } = result;

    // ARTIST-BASED SEARCH
    if (artist) {
        const artists = await prisma.artist.findFirst({
            where: { name: { contains: artist, mode: "insensitive" } }
        });

        if (!artists) {
            if (category) {
                const songs = await prisma.song.findMany({
                    where: { category: { contains: category, mode: "insensitive" } },
                    take: limit,
                    include: { artists: true, album: true }
                });
                return res.status(200).json({ success: true, source: "Category Fallback", songs });
            }
            return res.status(404).json({ success: false, message: "Artist not found" });
        }

        console.log("Artist ID:", artists.id);

        if (category) {
            const artistSongs = await prisma.song.findMany({
                where: {
                    artists: { some: { id: artists.id } },
                    category: { contains: category, mode: "insensitive" }
                },
                take: limit,
                include: { artists: true, album: true }
            });

            if (artistSongs.length > 0) {
                return res.status(200).json({ success: true, source: "Artist + Category", songs: artistSongs });
            }
        }

        // ARTIST ONLY FALLBACK
        const artistSongs = await prisma.song.findMany({
            where: { artists: { some: { id: artists.id } } },
            take: limit,
            include: { artists: true, album: true }
        });

        if (artistSongs.length > 0) {
            return res.status(200).json({ success: true, source: "Artist Fallback", songs: artistSongs });
        }
    }

    if (category) {
        const songs = await prisma.song.findMany({
            where: { category: { contains: category, mode: "insensitive" } },
            take: limit,
            include: { artists: true, album: true }
        });

        if (songs.length > 0) {
            return res.status(200).json({ success: true, source: "Category", songs });
        }
    }

    if (!artist && !category) {
        const songs = await prisma.song.findMany({ take: limit, include: { artists: true, album: true } });
        return res.status(200).json({ success: true, source: "General Fallback", songs });
    }

    return res.status(404).json({ success: false, message: "No songs found" });
});

export const createAIPlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { message } = req.body;

    if (!message || !String(message).trim()) throw new AppError("Message is required", 400);

    const { playlist, source } = await createAIPlaylistForUser(String(message).trim(), req.user.id);

    return res.status(201).json({ success: true, playlist, source });
});

export const getAILyrics = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { songId, prompt, action, targetLanguage } = req.body;

    if (!songId || !String(songId).trim()) throw new AppError("songId is required", 400);

    const allowedActions = ["translate", "explain", "mood", "all"];
    const normalizedAction = action && allowedActions.includes(action) ? action : "explain";

    const response = await getAILyricsExplanation({
        songId: String(songId).trim(),
        prompt: prompt ? String(prompt).trim() : undefined,
        action: normalizedAction,
        targetLanguage: targetLanguage ? String(targetLanguage).trim() : "Hindi",
    });

    if (!response.success && response.error === "SONG_NOT_FOUND") {
        return res.status(404).json(response);
    }

    return res.status(200).json(response);
});

export const chatbotAssistant = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { message } = req.body;

    if (!message || !String(message).trim()) throw new AppError("Message is required", 400);

    const userId = req.user?.id;

    // User ka data fetch karo — shared service functions use karke (DRY)
    const [liked_songs, playlists, recent_played] = await Promise.all([
        getUserLikedSongs(userId),
        getUserPlaylists(userId),
        getUserRecentlyPlayed(userId),
    ]);

    const userContext = { liked_songs, playlists, recent_played };

    const result = await callChatbotAssistant({
        message: String(message).trim(),
        userId,
        userContext,
    });

    // Agar agent ne playlist banane ka decide kiya, createAIPlaylistForUser use karo
    // Ye Node.js ka existing function hai jo full DB search + Prisma create karta hai
    let createdPlaylist = null;
    if (result?.pending_playlist && userId) {
        const { name, description } = result.pending_playlist;
        try {
            // Message bana ke existing function ko do — wohi LLM + DB search karega
            const playlistMessage = description && description !== name
                ? `${name}: ${description}`
                : name;
            const { playlist } = await createAIPlaylistForUser(playlistMessage, userId);
            createdPlaylist = playlist;
            console.log(`[Echo Agent] Created playlist '${playlist.name}' with ${playlist.songs?.length ?? 0} songs`);
        } catch (err) {
            console.error("[Echo Agent] Playlist creation failed:", err);
        }
    }

    let songToPlay = null;
    if (result?.play_song?.id) {
        const fullSong = await prisma.song.findUnique({
            where: { id: result.play_song.id },
            include: {
                artists: { select: { id: true, name: true, imageUrl: true } },
                album: { select: { id: true, title: true, imageUrl: true } },
            },
        });
        if (fullSong && !fullSong.isDeleted) {
            songToPlay = fullSong;
        }
    }

    return res.status(200).json({
        reply: result?.reply ?? "Kuch problem aa gayi. Dobara try karein.",
        playlist: createdPlaylist ?? null,
        play_song: songToPlay,
    });
});
