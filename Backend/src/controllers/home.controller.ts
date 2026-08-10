import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
    getPopularArtists,
    getTrendingSongs,
    getNewReleases,
    getRecentlyPlayed
} from "../service/home.service.js";


export const getHomeData = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.id;
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        if (!userId) return res.status(401).json(
            {
                message: "Unauthorized"
            }
        );
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

    } catch (error) {
        console.error("Error in getHomeData controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
