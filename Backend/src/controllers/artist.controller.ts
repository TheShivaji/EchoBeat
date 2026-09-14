import type { Response } from "express";
import { prisma } from "../config/db.js";
import { imagekit } from "../utils/multer.js";
import type { AuthRequest } from '../middleware/auth.middleware.js'
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// create artist by admin
export const createArtist = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, bio } = req.body;

    if (!name || !bio) throw new AppError("Name and bio are required", 400);

    const normalizedName = name.trim();

    const alreadyExist = await prisma.artist.findFirst({
        where: { name: { equals: normalizedName, mode: 'insensitive' } }
    });
    if (alreadyExist) throw new AppError("Artist already exists", 400);

    if (!req.file) throw new AppError("Image file is required", 400);
    const imageFile = req.file;

    const imageKitResponse = await imagekit.upload({
        file: imageFile.buffer,
        fileName: imageFile.originalname,
        folder: "artists"
    });

    if (!imageKitResponse.url) throw new AppError("Failed to upload image", 400);

    const artist = await prisma.artist.create({
        data: {
            name: normalizedName,
            imageUrl: imageKitResponse.url,
            bio: bio.trim()
        }
    });

    if (!artist) {
        await imagekit.deleteFile(imageKitResponse.fileId);
        throw new AppError("Failed to create artist", 400);
    }

    return res.status(201).json({ success: true, message: "Artist created successfully", artist });
});

export const getArtistDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id: artistId } = req.params;

    if (!artistId) throw new AppError("Artist ID is required", 400);

    const artist = await prisma.artist.findUnique({
        where: { id: String(artistId) },
        include: {
            _count: { select: { songs: true, albums: true } }
        }
    });

    if (!artist) throw new AppError("Artist not found", 404);
    if (artist.isDeleted) throw new AppError("Artist not found", 404);

    return res.status(200).json({ message: "Artist details fetched successfully", artist });
});

export const getArtistSongs = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id: artistId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page < 1 || limit < 1) throw new AppError("Page and limit should be greater than 0", 400);
    if (!artistId) throw new AppError("Artist ID is required", 400);

    const artist = await prisma.artist.findUnique({ where: { id: String(artistId) } });
    if (artist?.isDeleted) throw new AppError("Artist not found", 404);

    const songs = await prisma.song.findMany({
        where: {
            artists: { some: { id: String(artistId), isDeleted: false } },
            isDeleted: false
        },
        include: {
            artists: { where: { isDeleted: false } },
            album: true
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    const totalSongs = await prisma.song.count({
        where: {
            artists: { some: { id: String(artistId), isDeleted: false } },
            isDeleted: false
        }
    });

    return res.status(200).json({
        message: "Artist songs fetched successfully",
        songs,
        pagination: { total: totalSongs, page, limit, totalPages: Math.ceil(totalSongs / limit) }
    });
});

export const getArtistAlbam = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id: artistId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (!artistId) throw new AppError("Artist ID is required", 400);

    const artist = await prisma.artist.findUnique({ where: { id: String(artistId) } });
    if (!artist || artist.isDeleted) throw new AppError("Artist not found", 404);

    const skip = (page - 1) * limit;

    const albums = await prisma.album.findMany({
        where: { artists: { some: { id: String(artistId) } } },
        skip,
        take: limit,
        include: { artists: true, songs: true }
    });

    const totalAlbums = await prisma.album.count({
        where: { artists: { some: { id: String(artistId) } } }
    });

    return res.status(200).json({
        message: "Artist albums fetched successfully",
        albums,
        pagination: { total: totalAlbums, page, limit, totalPages: Math.ceil(totalAlbums / limit) }
    });
});

export const getAllArtists = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const artists = await prisma.artist.findMany({
        where: { isDeleted: false },
        select: { id: true, name: true, imageUrl: true },
        skip,
        take: limit
    });

    if (artists.length === 0) {
        return res.status(200).json({
            message: "No artists found",
            artists: [],
            pagination: { total: 0, page, limit, totalPages: 0 }
        });
    }

    const totalArtists = await prisma.artist.count({ where: { isDeleted: false } });

    return res.status(200).json({
        message: "artists featch successfully",
        artists,
        pagination: { total: totalArtists, page, limit, totalPages: Math.ceil(totalArtists / limit) }
    });
});

export const deleteArtist = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id: artistId } = req.params;

    if (!artistId) throw new AppError("Artist ID is required", 400);

    const artist = await prisma.artist.findUnique({ where: { id: String(artistId) } });
    if (!artist || artist.isDeleted) throw new AppError("Artist does not exist or is already deleted", 404);

    await prisma.artist.update({
        where: { id: String(artistId) },
        data: { isDeleted: true, deletedAt: new Date() }
    });

    return res.status(200).json({ message: "artist delete successfully" });
});