import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { prisma } from "../config/db.js";
import { imagekit } from "../utils/multer.js";
import { extractEmbeddedCover } from "../utils/audioMetadata.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { deleteCacheByPattern, deleteHomeCache } from "../utils/cache.js";


async function addToAlbum(albumID: string, songID: string, action: string, res: Response) {
    if (!albumID || !songID || !action) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const findAlbum = await prisma.album.findUnique({ where: { id: albumID } })
    const findSong = await prisma.song.findUnique({ where: { id: songID } })
    if (!findAlbum) {
        return res.status(404).json({ message: "Album not found" })
    }
    if (!findSong) {
        return res.status(404).json({ message: "Song not found" })
    }

    if (action !== "add" && action !== "remove") {
        return res.status(400).json({ message: "Invalid action" })
    }

    const actionOnSong = await prisma.album.update({
        where: { id: albumID },
        data: {
            songs: action === "add"
                ? { connect: { id: songID } }
                : { disconnect: { id: songID } }
        }
    });

    await deleteCacheByPattern("search:songs:*");
    await deleteHomeCache();

    return res.status(200).json({
        message: `Song ${action === "add" ? "added to" : "removed from"} album successfully`,
        album: actionOnSong
    })
}

export const uploadSong = asyncHandler(async (req: AuthRequest, res: Response) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const audioFile = files["audioFile"]?.[0];
    const imageFile = files["imageFile"]?.[0];

    // Audio is required
    if (!audioFile) throw new AppError("Please upload an audio file", 400);

    const { title, artistId, duration, category, albumID } = req.body;

    // Basic validation
    if (!title || !artistId || !duration) throw new AppError("Please fill all the details (title, artistId, duration)", 400);

    const DEFAULT_IMAGE_URL =
        "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop";

    // Check artist
    const artistExists = await prisma.artist.findFirst({
        where: { id: String(artistId), isDeleted: false },
    });
    if (!artistExists) throw new AppError("Artist not found", 404);

    // Check album if provided
    if (albumID) {
        const albumExists = await prisma.album.findFirst({ where: { id: String(albumID) } });
        if (!albumExists) throw new AppError("Album not found", 404);
    }

    // Extract embedded cover from audio
    const embeddedCover = await extractEmbeddedCover(audioFile.buffer, audioFile.mimetype);

    // Audio upload
    const audioUploadPromise = imagekit.upload({
        file: audioFile.buffer,
        fileName: audioFile.originalname,
        folder: "Songs",
    });

    // Cover upload
    let imageUploadPromise;

    if (imageFile) {
        // Priority 1: User uploaded cover
        imageUploadPromise = imagekit.upload({
            file: imageFile.buffer,
            fileName: imageFile.originalname,
            folder: "Songs/Images",
        });
    } else if (embeddedCover) {
        // Priority 2: Embedded cover from audio
        imageUploadPromise = imagekit.upload({
            file: embeddedCover.buffer,
            fileName: audioFile.originalname.split(".")[0] + "-cover",
            folder: "Songs/Images",
        });
    } else {
        // Priority 3: Default cover
        imageUploadPromise = Promise.resolve(null);
    }

    // Upload audio and cover in parallel
    const [audioUploadResponse, imageUploadResponse] = await Promise.all([
        audioUploadPromise,
        imageUploadPromise,
    ]);

    // Final image URL
    const imageUrl = imageUploadResponse?.url ?? DEFAULT_IMAGE_URL;

    // Create song
    const song = await prisma.song.create({
        data: {
            title: String(title),
            artists: { connect: { id: String(artistId) } },
            audioUrl: audioUploadResponse.url,
            imageUrl,
            duration: parseInt(String(duration), 10),
            category: category ? String(category) : null,
            releasedDate: new Date().toISOString(),
            ...(albumID ? { album: { connect: { id: String(albumID) } } } : {}),
        },
    });
    await deleteCacheByPattern("search:songs:*");
    await deleteHomeCache();

    return res.status(201).json({ success: true, message: "Song uploaded successfully", song });
});

export const deleteSong = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== 'string') throw new AppError("Song ID is invalid", 400);

    const song = await prisma.song.delete({ where: { id } });

    if (song.albumID) {
        await prisma.album.update({
            where: { id: song.albumID },
            data: { songs: { delete: { id: song.id } } }
        })
    }

    await deleteCacheByPattern("search:songs:*");
    await deleteCacheByPattern("home:recently_played:*");
    await deleteHomeCache();

    return res.status(200).json({ message: "Song deleted successfully", song });
});

export const addSongToAlbum = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { albumID } = req.params;
    const { songID, action } = req.body;
    if (typeof albumID !== "string") throw new AppError("Invalid album ID", 400);

    //Function call to add song to album
    await addToAlbum(albumID, songID, action, res);
});

export const getAllSongs = asyncHandler(async (req: AuthRequest, res: Response) => {
    const songs = await prisma.song.findMany({
        where: { isDeleted: false },
        include: {
            artists: { where: { isDeleted: false } },
            album: true
        }
    });
    return res.status(200).json(songs);
});

export const getNewReleasesPaginated = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    if (page < 1 || limit < 1) throw new AppError("Invalid pagination params", 400);

    const skip = (page - 1) * limit;

    const newReleases = await prisma.song.findMany({
        where: {
            isDeleted: false,
            artists: { none: { isDeleted: true } }
        },
        include: {
            artists: { where: { isDeleted: false } }
        },
        orderBy: { releasedDate: "desc" },
        skip,
        take: limit
    });

    const hasMore = newReleases.length === limit;

    return res.status(200).json({ success: true, songs: newReleases, hasMore });
});

export const getSongDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { songID } = req.params;

    if (!songID || typeof songID !== "string") throw new AppError("Song ID is required", 400);

    const song = await prisma.song.findUnique({
        where: { id: songID },
        include: { artists: true, album: true }
    });

    if (!song) throw new AppError("Song not found", 404);

    const songLikeDetails = await prisma.likedSong.findUnique({
        where: { userId_songId: { userId: req.user.id, songId: songID } }
    });
    const isLiked = songLikeDetails !== null;

    const likeCount = await prisma.likedSong.count({ where: { songId: songID } });

    const primaryArtistId = song.artists[0]?.id;
    const relatedSongs = primaryArtistId ? await prisma.song.findMany({
        where: {
            id: { not: songID },
            isDeleted: false,
            artists: { some: { id: primaryArtistId } }
        },
        take: 15,
        include: { artists: true, album: true }
    }) : [];

    return res.status(200).json({
        success: true,
        message: "Song details fetched successfully",
        song,
        isLiked,
        likeCount,
        relatedSongs
    });
});

export const likeSong = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { songId } = req.params;
    if (!songId || typeof songId !== "string") throw new AppError("Song ID is invalid", 400);

    const song = await prisma.song.findUnique({ where: { id: songId } });
    if (!song) throw new AppError("Song not found", 404);

    const alreadyLikedSong = await prisma.likedSong.findUnique({
        where: { userId_songId: { userId: req.user.id, songId } }
    });
    if (alreadyLikedSong) throw new AppError("Song already liked", 400);

    const likedSong = await prisma.likedSong.create({
        data: { userId: req.user.id, songId }
    });

    return res.status(200).json({ message: "Song liked successfully", likedSong });
});

export const unlikeSong = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { songId } = req.params;
    if (!songId || typeof songId !== "string") throw new AppError("Song ID is invalid", 400);

    const song = await prisma.song.findUnique({ where: { id: songId } });
    if (!song) throw new AppError("Song not found", 404);

    const likedSong = await prisma.likedSong.findUnique({
        where: { userId_songId: { userId: req.user.id, songId } }
    });
    if (!likedSong) throw new AppError("Song not liked", 400);

    const unlikedSong = await prisma.likedSong.delete({ where: { id: likedSong.id } });

    return res.status(200).json({ message: "Song unliked successfully", unlikedSong });
});

export const getAllLikedSongs = asyncHandler(async (req: AuthRequest, res: Response) => {
    const likedSongs = await prisma.likedSong.findMany({
        where: { userId: req.user.id },
        include: { song: true }
    });

    if (!likedSongs.length) throw new AppError("No liked songs found", 404);

    return res.status(200).json({ message: "Liked songs fetched successfully", likedSongs });
});
