import { prisma } from "../config/db.js"
import { imagekit } from "../utils/multer.js"
import type { AuthRequest } from "../middleware/auth.middleware.js"
import type { Response } from "express"
import asyncHandler from "../utils/asyncHandler.js"
import AppError from "../utils/AppError.js"

export const createAlbum = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { artistId, title, releaseYear } = req.body;
    const imageFile = req.file;

    if (!artistId || !title || !releaseYear) throw new AppError("All fields (title, artistId, releaseYear) are required", 400);

    const parsedReleaseYear = parseInt(releaseYear, 10);
    if (isNaN(parsedReleaseYear)) throw new AppError("Release year must be a valid number", 400);

    // Verify artist exists and is not deleted
    const artistExists = await prisma.artist.findFirst({
        where: { id: String(artistId), isDeleted: false }
    });
    if (!artistExists) throw new AppError("Artist not found", 404);

    let finalImageUrl = "default-album-cover-url";

    if (imageFile) {
        const uploadResponse = await imagekit.upload({
            file: imageFile.buffer,
            fileName: imageFile.originalname,
            folder: "Albums/Images",
        });
        finalImageUrl = uploadResponse.url;
    }

    const album = await prisma.album.create({
        data: {
            title,
            imageUrl: finalImageUrl,
            releaseYear: parsedReleaseYear,
            artists: { connect: { id: String(artistId) } }
        }
    });

    return res.status(201).json({ message: "Album created successfully", album });
});

export const getAllAlbums = asyncHandler(async (req: AuthRequest, res: Response) => {
    const albums = await prisma.album.findMany({
        include: { songs: true, artists: true }
    });
    return res.status(200).json({ message: "All albums fetched successfully", albums });
});

export const getAlbumDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throw new AppError("Album ID is required", 400);

    const album = await prisma.album.findUnique({
        where: { id: String(id) },
        include: { songs: true, artists: true }
    });
    if (!album) throw new AppError("Album not found", 404);

    return res.status(200).json({ message: "Album details fetched successfully", album });
});

export const deleteAlbum = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throw new AppError("Album ID is required", 400);

    const findAlbum = await prisma.album.findUnique({ where: { id: String(id) } });
    if (!findAlbum) throw new AppError("Album not found", 404);

    const album = await prisma.album.delete({ where: { id: String(id) } });
    return res.status(200).json({ message: "Album deleted successfully", album });
});

export const updateAlbum = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throw new AppError("Album ID is required", 400);

    const { artistId, imageUrl, title, releaseYear } = req.body;
    if (!artistId || !imageUrl || !title || !releaseYear) throw new AppError("All fields (including artistId) are required", 400);

    const findAlbum = await prisma.album.findUnique({ where: { id: String(id) } });
    if (!findAlbum) throw new AppError("Album not found", 404);

    const parsedReleaseYear = parseInt(releaseYear, 10);
    if (isNaN(parsedReleaseYear)) throw new AppError("Release year must be a valid number", 400);

    const artistExists = await prisma.artist.findFirst({
        where: { id: String(artistId), isDeleted: false }
    });
    if (!artistExists) throw new AppError("Artist not found", 404);

    const album = await prisma.album.update({
        where: { id: String(id) },
        data: {
            title,
            imageUrl,
            releaseYear: parsedReleaseYear,
            artists: {
                // This links the new artist. If you want to replace entirely, use 'set'
                connect: { id: String(artistId) }
            }
        }
    });

    return res.status(200).json({ message: "Album updated successfully", album });
});