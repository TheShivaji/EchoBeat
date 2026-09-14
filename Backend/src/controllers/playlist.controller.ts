import { prisma } from "../config/db.js"
import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { Response } from "express";
import { imagekit } from "../utils/multer.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// 1. Create Playlist (Scenario B: Custom Multiple Playlists)
export const createPlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const imageFile = files?.['imageFile']?.[0];

    if (!imageFile) throw new AppError("Please upload playlist cover image", 400);

    const { name, description, isPublic } = req.body;
    if (!name || !description) throw new AppError("Please fill all details (name, description)", 400);

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
});

export const updatePlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throw new AppError("Playlist ID is required", 400);

    const existingPlaylist = await prisma.playlist.findUnique({ where: { id: String(id) } });
    if (!existingPlaylist) throw new AppError("Playlist not found", 404);
    if (existingPlaylist.userId !== req.user.id) throw new AppError("Unauthorized: You do not own this playlist", 403);

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
});


export const getUserPlaylists = asyncHandler(async (req: AuthRequest, res: Response) => {
    const playlists = await prisma.playlist.findMany({ where: { userId: req.user.id } });
    return res.status(200).json({ message: "Playlists fetched successfully", playlists });
});

export const getPlaylistDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const playlist = await prisma.playlist.findUnique({
        where: { id: String(id) },
        include: {
            songs: {
                where: { isDeleted: false },
                include: {
                    artists: { where: { isDeleted: false } },
                    album: true
                }
            }
        }
    });

    if (!playlist) throw new AppError("Playlist not found", 404);
    if (!playlist.isPublic && playlist.userId !== req.user.id) throw new AppError("Access denied to private playlist", 403);

    return res.status(200).json({ message: "Playlist details fetched successfully", playlist });
});

// 5. Delete Playlist
export const deletePlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throw new AppError("Playlist ID is required", 400);

    const existingPlaylist = await prisma.playlist.findUnique({ where: { id: String(id) } });
    if (!existingPlaylist) throw new AppError("Playlist not found", 404);
    if (existingPlaylist.userId !== req.user.id) throw new AppError("Unauthorized: You do not own this playlist", 403);

    const deletedPlaylist = await prisma.playlist.delete({ where: { id: String(id) } });
    return res.status(200).json({ message: "Playlist deleted successfully", playlist: deletedPlaylist });
});

export const songAddToPlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { playlistId } = req.params;
    const { songId, action } = req.body;

    if (!playlistId || !songId || !action) throw new AppError("Playlist ID and Song ID are required", 400);
    if (action !== "add" && action !== "remove") throw new AppError("Invalid action", 400);

    const existingPlaylist = await prisma.playlist.findUnique({
        where: { id: String(playlistId) },
        include: { songs: { select: { id: true } } }
    });

    if (!existingPlaylist) throw new AppError("Playlist not found", 404);
    if (existingPlaylist.userId !== req.user.id) throw new AppError("Unauthorized: You do not own this playlist", 403);

    const existinSong = await prisma.song.findUnique({ where: { id: String(songId) } });
    if (!existinSong) throw new AppError("Song not found", 404);

    // Check for duplicates before adding
    const songExistsInPlaylist = existingPlaylist.songs.some(song => song.id === songId);

    if (action === "add" && songExistsInPlaylist) throw new AppError("Song is already in this playlist", 400);
    if (action === "remove" && !songExistsInPlaylist) throw new AppError("Song is not in this playlist", 400);

    const actionPlaylist = await prisma.playlist.update({
        where: { id: String(playlistId) },
        data: {
            songs: action == "add"
                ? { connect: { id: String(songId) } }
                : { disconnect: { id: String(songId) } }
        }
    });

    return res.status(200).json({
        message: `Song ${action == "add" ? "added" : "removed"} to playlist successfully`,
        playlist: actionPlaylist
    });
});