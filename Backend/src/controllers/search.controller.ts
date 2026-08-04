import { prisma } from "../config/db.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { Response } from "express";
import { Prisma } from "@prisma/client";
import { title } from "node:process";

const validation = async function (res: Response, req: AuthRequest) {
    const { q, page = 1, limit = 20 } = req.query;

    const searchQuery = String(q).trim();

    if (!q || searchQuery === "") {
        res.status(400).json({
            message: "Query is required"
        });
        return null;
    }
    if (Number(page) < 1 || Number(limit) < 1) {
        res.status(404).json({ message: "Page and limit should be greater than 0" });
        return null;
    }
    const skip = (Number(page) - 1) * Number(limit)
    const take = Number(limit)

    return {
        take,
        skip,
        searchQuery,
        page: Number(page),
        limit: Number(limit),
    }
}

export const searchArtists = async (req: AuthRequest, res: Response) => {
    try {

        const searchParams = await validation(res, req)
        if (!searchParams) return;
        const { searchQuery, skip, take, page, limit } = searchParams;

        const artist = await prisma.artist.findMany({
            where: {
                isDeleted: false,
                name: {
                    contains: searchQuery,
                    mode: "insensitive"
                }
            },
            skip,
            take
        })

        const totalArtists = await prisma.artist.count({
            where: {
                isDeleted: false,
                name: {
                    contains: searchQuery,
                    mode: "insensitive"
                }
            }
        })

        if (artist.length === 0) {
            return res.status(404).json({
                message: "Artist Not Founded"
            })
        }

        return res.status(200).json({
            message: "artist founded",
            artist,
            pagination: {
                total: totalArtists,
                page,
                limit,
                totalPages: Math.ceil(totalArtists / limit)
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const searchSong = async function (req: AuthRequest, res: Response) {

    try {
        const searchParams = await validation(res, req)
        if (!searchParams) return;
        const { searchQuery, skip, take, page, limit } = searchParams;
        const where: Prisma.SongWhereInput = {
            // Ensure no artist on the song is deleted
            artists: {
                none: {
                    isDeleted: true
                }
            },
            OR: [
                {
                    title: {
                        contains: searchQuery,
                        mode: "insensitive"
                    }
                },
                {
                    artists: {
                        some: {
                            name: {
                                contains: searchQuery,
                                mode: "insensitive"
                            },
                            // Ensure the searched artist is also not deleted
                            isDeleted: false
                        }
                    }
                }
            ]
        }


        const song = await prisma.song.findMany({
            where,
            skip,
            take


        });

        if (song.length === 0) {
            return res.status(404).json({
                message: "Songs Not Founded"
            })
        }

        const totalSong = await prisma.song.count({
            where
        })

        return res.status(200).json({
            message: "song founded",
            song,
            pagination: {
                total: Number(totalSong),
                page,
                limit,
                totalPages: Math.ceil(totalSong / limit)
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const searchAlbum = async (req: AuthRequest, res: Response) => {
    try {
        const searchParams = await validation(res, req)
        if (!searchParams) return
        const { searchQuery, take, page, limit, skip } = searchParams

        const where: Prisma.AlbumWhereInput = {
            artists: {
                none: {
                    isDeleted: true
                }
            },
            OR: [
                {
                    title: {
                        contains: searchQuery,
                        mode: "insensitive"
                    }
                },
                {
                    artists: {
                        some: {
                            name: {
                                contains: searchQuery,
                                mode: "insensitive"
                            },
                            // Ensure the searched artist is also not deleted
                            isDeleted: false
                        }
                    }
                }
            ]
        }

        const album = await prisma.album.findMany({
            where,
            skip,
            take
        })

        if (album.length === 0) {
            return res.status(404).json({
                message: "Albums Not Founded"
            })
        }

        const totalAlbum = await prisma.album.count({
            where
        })

        return res.status(200).json({
            message: "album founded",
            album,
            pagination: {
                total: Number(totalAlbum),
                page,
                limit,
                totalPages: Math.ceil(totalAlbum / limit)
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const searchPlaylist = async (req: AuthRequest, res: Response) => {
    try {
        const searchParams = await validation(res, req)
        if (!searchParams) return
        const { searchQuery, take, page, limit, skip } = searchParams

        const where: Prisma.PlaylistWhereInput = {
            isPublic: true, 
            OR: [
                {
                    name: {
                        contains: searchQuery,
                        mode: "insensitive"
                    }
                },
                {
                    description: {
                        contains: searchQuery,
                        mode: "insensitive"
                    }
                }
            ]
        }

        const playlist = await prisma.playlist.findMany({
            where,
            skip,
            take,
            orderBy: {
                name: "asc"
            }
        })

        if (playlist.length === 0) {
            return res.status(404).json({
                message: "Playlists Not Founded"
            })
        }

        const totalPlaylist = await prisma.playlist.count({
            where
        })

        return res.status(200).json({
            message: "playlist founded",
            playlist,
            pagination: {
                total: Number(totalPlaylist),
                page,
                limit,
                totalPages: Math.ceil(totalPlaylist / limit)
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}
