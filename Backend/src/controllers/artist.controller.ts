import type { Response } from "express";
import { prisma } from "../config/db.js";
import { imagekit } from "../utils/multer.js";
import type { AuthRequest } from '../middleware/auth.middleware.js'

// create artist by admin
export const createArtist = async (req: AuthRequest, res: Response) => {
    try {
        const { name, bio } = req.body;


        if (!name || !bio) {
            return res.status(400).json({ message: "Name and bio are required" });
        }


        const normalizedName = name.trim();


        const alreadyExist = await prisma.artist.findFirst({
            where: {
                name: {
                    equals: normalizedName,
                    mode: 'insensitive'
                }
            }
        });

        if (alreadyExist) {
            return res.status(400).json({ message: "Artist already exists" });
        }


        if (!req.file) {
            return res.status(400).json({ message: "Image file is required" });
        }
        const imageFile = req.file;


        const imageKitResponse = await imagekit.upload({
            file: imageFile.buffer,
            fileName: imageFile.originalname,
            folder: "artists"
        });

        if (!imageKitResponse.url) {
            return res.status(400).json({ message: "Failed to upload image" });
        }

        const artist = await prisma.artist.create({
            data: {
                name: normalizedName,
                imageUrl: imageKitResponse.url,
                bio: bio.trim()
            }
        });

        if (!artist) {
            await imagekit.deleteFile(imageKitResponse.fileId);
            return res.status(400).json({ message: "Failed to create artist" });
        }

        return res.status(201).json({ message: "Artist created successfully", artist });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: "Artist already exists!" });
        }
        console.error("Error creating artist:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getArtistDetails = async (req: AuthRequest, res: Response) => {
    try {
        const { id: artistId } = req.params

        if (!artistId) {
            return res.status(400).json({ message: "Artist ID is required" })
        }

        const artist = await prisma.artist.findUnique({
            where: {
                id: String(artistId)
            },
            include: {
                _count: {
                    select: {
                        songs: true,
                        albums: true
                    }
                }
            }
        })
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" })
        }
        return res.status(200).json(
            {
                message: "Artist details fetched successfully",
                artist
            })
    } catch (error) {
        console.error("Error fetching artist details:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getArtistSongs = async (req: AuthRequest, res: Response) => {
    try {
        const { id: artistId } = req.params
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10

        if (page < 1 || limit < 1) {
            return res.status(400).json({ message: "Page and limit should be greater than 0" })
        }

        if (!artistId) {
            return res.status(400).json({ message: "Artist ID is required" })
        }

        const songs = await prisma.song.findMany({
            where: {
                artists: {
                    some: {
                        id: String(artistId)
                    }
                }
            },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),

        })
        if (songs.length === 0) {
            return res.status(404).json({ message: "No songs found" })
        }

        const totalSongs = await prisma.song.count({
            where: {
                artists: {
                    some: {
                        id: String(artistId)
                    }
                }
            }
        })

        return res.status(200).json({
            message: "Artist songs fetched successfully",
            songs,
            pagination: {
                total: totalSongs,
                page,
                limit,
                totalPages: Math.ceil(totalSongs / limit)
            }
        })
    } catch (error) {
        console.error("Error fetching artist songs:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getArtistAlbam = async (req: AuthRequest, res: Response) => {
    try {
        const { id: artistId } = req.params;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        if (!artistId) {
            return res.status(400).json({ message: "Artist ID is required" });
        }

        const skip = (page - 1) * limit;
        const take = limit;

        const albums = await prisma.album.findMany({
            where: {
                artists: {
                    some: {
                        id: String(artistId)
                    }
                }
            },
            skip,
            take,
            include: {
                artists: true,
                songs: true, 
            }
        });

        if (albums.length === 0) {
            return res.status(404).json({ message: "No albums found" });
        }

       
        const totalAlbums = await prisma.album.count({
            where: {
                artists: {
                    some: {
                        id: String(artistId)
                    }
                }
            }
        });

        return res.status(200).json({
            message: "Artist albums fetched successfully",
            albums,
            pagination: {
                total: totalAlbums,
                page,
                limit,
                totalPages: Math.ceil(totalAlbums / limit)
            }
        });
    } catch (error) {
        console.error("Error fetching artist albums:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
