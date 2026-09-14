import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
    getPopularArtists,
    getTrendingSongs,
    getNewReleases,
    getRecentlyPlayed
} from "../service/home.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";


export const getHomeData = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (!userId) throw new AppError("Unauthorized", 401);

    // All three queries run in parallel
    const [popularArtists, popularSongs, newReleases, recentlyPlayed] = await Promise.all([
        getPopularArtists(),
        getTrendingSongs(),
        getNewReleases(),
        getRecentlyPlayed(userId, page, limit),
    ]);

    return res.status(200).json({
        message: "Home data fetched successfully",
        popularArtists,
        popularSongs,
        newReleases,
        recentlyPlayed
    });
});

