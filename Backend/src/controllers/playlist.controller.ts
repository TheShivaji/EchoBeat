import { prisma } from "../config/db.js"
import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { Response } from "express";
import { imagekit } from "../utils/multer.js";

// 1. Create Playlist (Scenario B: Custom Multiple Playlists)
export const createPlaylist = async (req: AuthRequest, res: Response) => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const imageFile = files?.['imageFile']?.[0];

        if (!imageFile) {
            return res.status(400).json({ message: "Please upload playlist cover image" });
        }

        const { name, description, isPublic } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: "Please fill all details (name, description)" });
        }

        // Upload image to ImageKit
        const imageUploadResponse = await imagekit.upload({
            file: imageFile.buffer,
            fileName: imageFile.originalname,
            folder: "Playlists"
        });

        // Convert isPublic string to boolean safely
        const isPublicBool = isPublic === "true" || isPublic === true;

        const playlist = await prisma.playlist.create({
            data: {
                name,
                description,
                isPublic: isPublicBool,
                imageUrl: imageUploadResponse.url,
                userId: req.user.id
            }
        });

        return res.status(201).json({ message: "Playlist created successfully", playlist });
    } catch (error) {
        console.error("Error creating playlist:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updatePlaylist = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Playlist ID is required" });
        }


        const existingPlaylist = await prisma.playlist.findUnique({
            where: { id: String(id) }
        });

        if (!existingPlaylist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        if (existingPlaylist.userId !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized: You do not own this playlist" });
        }

        const { name, description, isPublic } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const imageFile = files?.['imageFile']?.[0];

        let imageUrl = existingPlaylist.imageUrl;

        // If a new image is provided, upload to ImageKit
        if (imageFile) {
            const imageUploadResponse = await imagekit.upload({
                file: imageFile.buffer,
                fileName: imageFile.originalname,
                folder: "Playlists"
            });
            imageUrl = imageUploadResponse.url;
        }

        const isPublicBool = isPublic !== undefined ? (isPublic === "true" || isPublic === true) : existingPlaylist.isPublic;

        const updatedPlaylist = await prisma.playlist.update({
            where: { id: String(id) },
            data: {
                name: name || existingPlaylist.name,
                description: description || existingPlaylist.description,
                isPublic: isPublicBool,
                imageUrl
            }
        });

        return res.status(200).json({ message: "Playlist updated successfully", playlist: updatedPlaylist });
    } catch (error) {
        console.error("Error updating playlist:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getUserPlaylists = async (req: AuthRequest, res: Response) => {
    try {
        const playlists = await prisma.playlist.findMany({
            where: { userId: req.user.id }
        });
        return res.status(200).json({ message: "Playlists fetched successfully", playlists });
    } catch (error) {
        console.error("Error fetching playlists:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getPlaylistDetails = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const playlist = await prisma.playlist.findUnique({
            where: { id: String(id) },
            include: {
                songs: true
            }
        });

        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }


        if (!playlist.isPublic && playlist.userId !== req.user.id) {
            return res.status(403).json({ message: "Access denied to private playlist" });
        }

        return res.status(200).json({ message: "Playlist details fetched successfully", playlist });
    } catch (error) {
        console.error("Error fetching playlist details:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// 5. Delete Playlist
export const deletePlaylist = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Playlist ID is required" });
        }

        const existingPlaylist = await prisma.playlist.findUnique({
            where: { id: String(id) }
        });

        if (!existingPlaylist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        if (existingPlaylist.userId !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized: You do not own this playlist" });
        }

        const deletedPlaylist = await prisma.playlist.delete({
            where: { id: String(id) }
        });

        return res.status(200).json({ message: "Playlist deleted successfully", playlist: deletedPlaylist });
    } catch (error) {
        console.error("Error deleting playlist:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};