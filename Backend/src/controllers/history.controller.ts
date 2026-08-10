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

        const MAX_HISTORY = 50;

        const recentHistory = await prisma.playHistory.findMany({
            where: {
                userId
            },
            orderBy: {
                playedAt: "desc"
            },
            take: MAX_HISTORY + 1
        });
        if (recentHistory.length > MAX_HISTORY) {
            const oldestRecord = recentHistory[recentHistory.length - 1];

            if (oldestRecord) {
                await prisma.playHistory.delete({
                    where: {
                        id: oldestRecord.id
                    }
                });
            }
        }
        return res.status(200).json({
            "message": "Song added to recently played",
            "history": historyRecord
        });
    } catch (error) {
        console.error("Error in playSong controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const deleteHistory = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user.id;
        const history = await prisma.playHistory.findMany({
            where: {
                userId
            }
        })
        if (history.length === 0) {
            return res.status(404).json({
                message: "No history found"
            })
        }
        await prisma.playHistory.deleteMany({
            where: {
                userId
            }
        })
        return res.status(200).json({
            message: "History deleted successfully"
        })
    } catch (error) {
        console.error("Error in deleteHistory controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


