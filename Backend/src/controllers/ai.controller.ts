import type { Request, Response } from "express";
import { understandMusicRequest, createAIPlaylistForUser, getAILyricsExplanation } from "../service/ai.service.js";
import { prisma } from "../config/db.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const understandMusic = async (
    req: Request,
    res: Response
) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                message: "Message is required",
            });
        }

        const result = await understandMusicRequest(message);
        console.log(result)

        const { artist, category, limit } = result;

        
        // ARTIST-BASED SEARCH
        

        if (artist) {

            const artists = await prisma.artist.findFirst({
                where: {
                    name: {
                        contains: artist,
                        mode: "insensitive"
                    }
                }
            });

            
            if (!artists) {

                if (category) {
                    const songs = await prisma.song.findMany({
                        where: {
                            category: {
                                contains: category,
                                mode: "insensitive"
                            }
                        },
                        take: limit,
                        include: {
                            artists: true,
                            album: true
                        }
                    });

                    return res.status(200).json({
                        success: true,
                        source: "Category Fallback",
                        songs
                    });
                }

                return res.status(404).json({
                    success: false,
                    message: "Artist not found"
                });
            }

            console.log("Artist ID:", artists.id);


            if (category) {

                const artistSongs = await prisma.song.findMany({
                    where: {
                        artists: {
                            some: {
                                id: artists.id
                            }
                        },
                        category: {
                            contains: category,
                            mode: "insensitive"
                        }
                    },
                    take: limit,
                    include: {
                        artists: true,
                        album: true
                    }
                });

                if (artistSongs.length > 0) {
                    return res.status(200).json({
                        success: true,
                        source: "Artist + Category",
                        songs: artistSongs
                    });
                }
            }

           
            // ARTIST ONLY FALLBACK
            

            const artistSongs = await prisma.song.findMany({
                where: {
                    artists: {
                        some: {
                            id: artists.id
                        }
                    }
                },
                take: limit,
                include: {
                    artists: true,
                    album: true
                }
            });

            if (artistSongs.length > 0) {
                return res.status(200).json({
                    success: true,
                    source: "Artist Fallback",
                    songs: artistSongs
                });
            }
        }

        

        if (category) {

            const songs = await prisma.song.findMany({
                where: {
                    category: {
                        contains: category,
                        mode: "insensitive"
                    }
                },
                take: limit,
                include: {
                    artists: true,
                    album: true
                }
            });

            if (songs.length > 0) {
                return res.status(200).json({
                    success: true,
                    source: "Category",
                    songs
                });
            }
        }

        if(!artist && !category){
            const songs = await prisma.song.findMany({take:limit, include:{artists:true, album:true}})

            return res.status(200).json({
                success: true,
                source: "General Fallback",
                songs
            })
        }

        return res.status(404).json({
            success: false,
            message: "No songs found"
        });

    } catch (error) {
        console.error("AI controller error:", error);

        return res.status(500).json({
            message: "Failed to process music request",
        });
    }
};

export const createAIPlaylist = async (req: AuthRequest, res: Response) => {
    try {
        const { message } = req.body;

        if (!message || !String(message).trim()) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        const { playlist, source } = await createAIPlaylistForUser(String(message).trim(), req.user.id);

        return res.status(201).json({
            success: true,
            playlist,
            source,
        });
    } catch (error: any) {
        if (error?.message?.toLowerCase().includes("no matching songs")) {
            return res.status(404).json({
                success: false,
                message: "No matching songs were found for this playlist.",
            });
        }

        console.error("AI playlist creation error:", error);
        return res.status(500).json({
            success: false,
            message: "Couldn't create the playlist. Please try again.",
        });
    }
};

export const getAILyrics = async (req: AuthRequest, res: Response) => {
    try {
        const { songId, prompt, action, targetLanguage } = req.body;

        if (!songId || !String(songId).trim()) {
            return res.status(400).json({ success: false, message: "songId is required" });
        }

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
    } catch (error: any) {
        console.error("AI lyrics processing error:", error);
        return res.status(500).json({
            success: false,
            message: "Couldn't process the lyrics right now. Please try again.",
        });
    }
};