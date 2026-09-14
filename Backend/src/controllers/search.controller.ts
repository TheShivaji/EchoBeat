import { prisma } from "../config/db.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { Response } from "express";
import { Prisma } from "@prisma/client";
import { routeQuery } from "../service/query-router.service.js";
import { getAIRecommendations } from "../service/ai.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const validation = async function (res: Response, req: AuthRequest) {
    const { q, page = 1, limit = 20 } = req.query;

    const searchQuery = String(q).trim();

    if (!q || searchQuery === "") {
        res.status(400).json({ message: "Query is required" });
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

export const searchArtists = asyncHandler(async (req: AuthRequest, res: Response) => {
    const searchParams = await validation(res, req)
    if (!searchParams) return;
    const { searchQuery, skip, take, page, limit } = searchParams;

    const artist = await prisma.artist.findMany({
        where: {
            isDeleted: false,
            name: { contains: searchQuery, mode: "insensitive" }
        },
        skip,
        take
    })

    const totalArtists = await prisma.artist.count({
        where: {
            isDeleted: false,
            name: { contains: searchQuery, mode: "insensitive" }
        }
    })

    return res.status(200).json({
        success: true,
        message: "artists found",
        artists: artist,
        pagination: { total: totalArtists, page, limit, totalPages: Math.ceil(totalArtists / limit) }
    })
});

export const searchSong = asyncHandler(async function (req: AuthRequest, res: Response) {
    const requestStart = performance.now();

    const searchParams = await validation(res, req);
    if (!searchParams) return;

    const { searchQuery, skip, take, page, limit } = searchParams;

    req.log.info({ searchQuery }, "Search request received");

    // Query Router
    const decision = routeQuery(searchQuery);

    if (decision === "AI_RECOMMENDATION") {
        req.log.info({ decision }, "Query routed");

        try {
            const aiResult = await getAIRecommendations(searchQuery);

            req.log.info({ resultCount: aiResult.songs.length }, "AI recommendation completed");
            req.log.info({ durationMs: Math.round(performance.now() - requestStart) }, "Search request completed");

            return res.status(200).json({
                success: true,
                message: "songs found",
                source: aiResult.source,
                songs: aiResult.songs,
                pagination: {
                    total: aiResult.songs.length,
                    page,
                    limit,
                    totalPages: Math.ceil(aiResult.songs.length / limit)
                }
            });

        } catch (error) {
            req.log.error({ error }, "AI recommendation failed");
            // Falls through to normal search
        }
    }

    // Normal Search
    const where: Prisma.SongWhereInput = {
        artists: { none: { isDeleted: true } },
        OR: [
            { title: { contains: searchQuery, mode: "insensitive" } },
            {
                artists: {
                    some: {
                        name: { contains: searchQuery, mode: "insensitive" },
                        isDeleted: false
                    }
                }
            }
        ]
    };

    const dbStart = performance.now();
    req.log.info({ searchQuery }, "Database query started");

    const findManyStart = performance.now();
    const song = await prisma.song.findMany({ where, skip, take, include: { artists: true } });
    const findManyDurationMs = Math.round(performance.now() - findManyStart);

    const countStart = performance.now();
    const totalSong = await prisma.song.count({ where });
    const countDurationMs = Math.round(performance.now() - countStart);

    req.log.info(
        { resultCount: song.length, findManyDurationMs, countDurationMs, totalDurationMs: Math.round(performance.now() - dbStart) },
        "Database queries completed (findMany + count)"
    );

    const response = {
        success: true,
        message: "songs found",
        source: "search",
        songs: song,
        pagination: {
            total: Number(totalSong),
            page,
            limit,
            totalPages: Math.ceil(totalSong / limit)
        }
    };

    req.log.info({ durationMs: Math.round(performance.now() - requestStart) }, "Search request completed");

    return res.status(200).json(response);
});

export const searchAlbum = asyncHandler(async (req: AuthRequest, res: Response) => {
    const searchParams = await validation(res, req)
    if (!searchParams) return
    const { searchQuery, take, page, limit, skip } = searchParams

    const where: Prisma.AlbumWhereInput = {
        artists: { none: { isDeleted: true } },
        OR: [
            { title: { contains: searchQuery, mode: "insensitive" } },
            {
                artists: {
                    some: {
                        name: { contains: searchQuery, mode: "insensitive" },
                        isDeleted: false
                    }
                }
            }
        ]
    }

    const album = await prisma.album.findMany({ where, skip, take })
    const totalAlbum = await prisma.album.count({ where })

    return res.status(200).json({
        success: true,
        message: "albums found",
        albums: album,
        pagination: { total: Number(totalAlbum), page, limit, totalPages: Math.ceil(totalAlbum / limit) }
    })
});

export const searchPlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
    const searchParams = await validation(res, req)
    if (!searchParams) return
    const { searchQuery, take, page, limit, skip } = searchParams

    const where: Prisma.PlaylistWhereInput = {
        isPublic: true,
        OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } }
        ]
    }

    const playlist = await prisma.playlist.findMany({ where, skip, take, orderBy: { name: "asc" } })
    const totalPlaylist = await prisma.playlist.count({ where })

    return res.status(200).json({
        success: true,
        message: "playlists found",
        playlists: playlist,
        pagination: { total: Number(totalPlaylist), page, limit, totalPages: Math.ceil(totalPlaylist / limit) }
    })
});
