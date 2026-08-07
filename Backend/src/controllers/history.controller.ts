import type { Response } from "express";
import { prisma } from "../config/db.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const playSong = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { songId } = req.body;
        const userId = req.user.id;

        if (!songId) {
            return res.status(400).json({ message: "Song ID is required" });
        }

        const song = await prisma.song.findUnique({
            where: {
                id: songId
            }
        })
        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        const historyRecord = await prisma.playHistory.upsert({
            where: {
                userId_songId: {
                    userId,
                    songId
                }
            },
            update: {
                playedAt: new Date()
            },
            create: {
                userId,
                songId
            }
        });

        return res.status(200).json({
            "message": "Song added to recently played",
            "history": historyRecord
        });
    } catch (error) {
        console.error("Error in playSong controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getRecentlyPlayed = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user.id;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        const skip = (page - 1) * limit;
        const take = limit

        if (page < 1 || limit < 1) {
            return res.status(400).json({ message: "Page and limit should be greater than 0" })
        }


        const recentlyPlayed = await prisma.playHistory.findMany({
            where: {
                userId
            },
            orderBy: {
                playedAt: 'desc'
            },
            skip,
            take,
            include: {
                song: {
                    include: {
                        artists: true,
                        album: true
                    }
                }
            }
        });
if (recentlyPlayed.length === 0){
    return res.status(404).json({
        message:"No recently played songs found"
    })
}
        return res.status(200).json({
            message:"Recently played songs found",
            recentlyPlayed
        });
    } catch (error) {
        console.error("Error in getRecentlyPlayed controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
