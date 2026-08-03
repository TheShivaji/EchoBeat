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


        if (!req.files) {
            return res.status(400).json({ message: "No files uploaded" });
        }
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const imageFile = files.imageFile?.[0];

        if (!imageFile) {
            return res.status(400).json({ message: "Image file is required" });
        }


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
