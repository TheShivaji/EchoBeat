import config from "../config/config.js";
import { prisma } from "../config/db.js";

export const understandMusicRequest = async (message: string) => {
    try {
        const response = await fetch(`${config.aiServiceUrl}/ai/understand`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message,
            }),
        });

        if (!response.ok) {
            throw new Error(`AI service request failed with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("AI service connection error:", error);
        throw error;
    }
};

export const getAIRecommendations = async (message: string) => {
    const result = await understandMusicRequest(message);
    const { artist, category } = result;
    
    // Ensure limit is safe (default 10, max 30)
    let limit = result.limit ? parseInt(result.limit) : 10;
    if (isNaN(limit) || limit < 1) limit = 10;
    if (limit > 30) limit = 30;

    let songs: any[] = [];
    let source = "General Fallback";

    if (artist) {
        const artistRecord = await prisma.artist.findFirst({
            where: {
                name: {
                    contains: artist,
                    mode: "insensitive"
                },
                isDeleted: false
            }
        });

        if (!artistRecord) {
            if (category) {
                songs = await prisma.song.findMany({
                    where: {
                        category: { contains: category, mode: "insensitive" },
                        artists: { none: { isDeleted: true } }
                    },
                    take: limit,
                    include: { artists: true, album: true }
                });
                source = "Category Fallback";
            }
        } else {
            if (category) {
                songs = await prisma.song.findMany({
                    where: {
                        artists: { some: { id: artistRecord.id } },
                        category: { contains: category, mode: "insensitive" },
                        // Ensure no other artist on the song is deleted
                        AND: [ { artists: { none: { isDeleted: true } } } ]
                    },
                    take: limit,
                    include: { artists: true, album: true }
                });

                if (songs.length > 0) {
                    source = "Artist + Category";
                }
            }

            if (songs.length === 0) {
                songs = await prisma.song.findMany({
                    where: {
                        artists: { some: { id: artistRecord.id } },
                        AND: [ { artists: { none: { isDeleted: true } } } ]
                    },
                    take: limit,
                    include: { artists: true, album: true }
                });
                if (songs.length > 0) {
                    source = "Artist Fallback";
                }
            }
        }
    }

    if (songs.length === 0 && category) {
        songs = await prisma.song.findMany({
            where: {
                category: { contains: category, mode: "insensitive" },
                artists: { none: { isDeleted: true } }
            },
            take: limit,
            include: { artists: true, album: true }
        });
        if (songs.length > 0) {
            source = "Category";
        }
    }

    if (songs.length === 0 && !artist && !category) {
        songs = await prisma.song.findMany({
            where: {
                artists: { none: { isDeleted: true } }
            },
            take: limit,
            include: { artists: true, album: true }
        });
        source = "General Fallback";
    }

    return {
        songs,
        source
    };
};