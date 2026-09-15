import type { Response } from "express";
import { prisma } from "../config/db.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { deleteCacheByPattern } from "../utils/cache.js";

export const playSong = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { songId } = req.body;
    const userId = req.user.id;

    if (!songId) throw new AppError("Song ID is required", 400);

    const song = await prisma.song.findUnique({ where: { id: songId } });
    if (!song) throw new AppError("Song not found", 404);

    const historyRecord = await prisma.playHistory.upsert({
        where: { userId_songId: { userId, songId } },
        update: { playedAt: new Date() },
        create: { userId, songId }
    });

    const MAX_HISTORY = 50;

    const recentHistory = await prisma.playHistory.findMany({
        where: { userId },
        orderBy: { playedAt: "desc" },
        take: MAX_HISTORY + 1
    });

    if (recentHistory.length > MAX_HISTORY) {
        const oldestRecord = recentHistory[recentHistory.length - 1];
        if (oldestRecord) {
            await prisma.playHistory.delete({ where: { id: oldestRecord.id } });
        }
    }

    await deleteCacheByPattern(`home:recently_played:${userId}:*`);

    return res.status(200).json({ message: "Song added to recently played", history: historyRecord });
});


export const deleteHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;

    const history = await prisma.playHistory.findMany({ where: { userId } });
    if (history.length === 0) throw new AppError("No history found", 404);

    await prisma.playHistory.deleteMany({ where: { userId } });

    await deleteCacheByPattern(`home:recently_played:${userId}:*`);

    return res.status(200).json({ message: "History deleted successfully" });
});


