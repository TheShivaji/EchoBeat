import type { Request, Response } from "express";
import { understandMusicRequest } from "../service/ai.service.js";
import { prisma } from "../config/db.js";

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