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
        if (recentlyPlayed.length === 0) {
            return res.status(404).json({
                message: "No recently played songs found"
            })
        }

        return res.status(200).json({
            message: "Recently played songs found",
            recentlyPlayed
        });
    } catch (error) {
        console.error("Error in getRecentlyPlayed controller:", error);
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


export const getPopularArtist = async (req: AuthRequest, res: Response): Promise<any> => {
    try {

        // Get the songId which are played by user 
        const popularSongs = await prisma.playHistory.groupBy({
            by: ["songId"],
            _count: {
                songId: true
            }
        })


        const songsIds = popularSongs.map(item => item.songId);

        const songs = await prisma.song.findMany({
            where: {
                id: {
                    in: songsIds
                }
            },
            include: {
                artists: true,
            }
        })


        const songPlayCount = new Map<string, number>();

        for (const item of popularSongs) {
            songPlayCount.set(
                item.songId,
                item._count.songId
            );
        }


        const artistPlayCount = new Map<string, number>();

        for (const song of songs) {

            // Is song ko kitni baar play kiya gaya?
            const plays = songPlayCount.get(song.id) ?? 0;

            // Is song ke artists
            for (const artist of song.artists) {

                const currentPlays =
                    artistPlayCount.get(artist.id) ?? 0;

                artistPlayCount.set(
                    artist.id,
                    currentPlays + plays
                );
            }
        }
        const artistIds = [...artistPlayCount.keys()];
        const artists = await prisma.artist.findMany({
            where: {
                id: {
                    in: artistIds
                },
                isDeleted: false
            },
        })

        const popularArtists = artists
            .map(artist => ({
                ...artist,
                playCount: artistPlayCount.get(artist.id) ?? 0
            }))
            .sort((a, b) => b.playCount - a.playCount)
            .slice(0, 10);



        return res.status(200).json({
            message: "Popular artists found",
            popularArtists
        })

        //response 
        //  {
        //   "message": "Popular artists found",
        //   "popularArtists": [
        //     {
        //       "id": "artist1",
        //       "name": "Artist 1",
        //       "imageUrl": "https://example.com/artist1.jpg", 
        //       "bio": "Some bio...",
        //       "isDeleted": false,
        //       "deletedAt": null,
        //       "createdAt": "2026-08-09T10:00:00.000Z",
        //       "updatedAt": "2026-08-09T10:00:00.000Z",
        //       "playCount": 18
        //     },
        //     {
        //       "id": "artist2",
        //       "name": "Artist 2",
        //       "imageUrl": "https://example.com/artist2.jpg", 
        //       "bio": "Some bio...",
        //       "isDeleted": false,
        //       "deletedAt": null,
        //       "createdAt": "2026-08-09T10:05:00.000Z",
        //       "updatedAt": "2026-08-09T10:05:00.000Z",
        //       "playCount": 15
        //     }
        //   ]
        // }

    } catch (error) {
        console.error("Error in getPopularArtist controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const getPopularSongs = async (req: AuthRequest, res: Response): Promise<any> => {
    try {

        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const trendingSongs = await prisma.playHistory.groupBy({
            by: ["songId"],
            where: {
                playedAt: {
                    gte: sevenDaysAgo
                }
            },
            _count: {
                songId: true
            },
            orderBy: {
                _count: {
                    songId: "desc"
                }
            },
            take: 10
        });

        const songIds = trendingSongs.map(item => item.songId);

        const songs = await prisma.song.findMany({
            where: {
                id: {
                    in: songIds
                },

            },
            include: {
                artists: true,
            }
        })

        const rankedSongs = trendingSongs.map((trending) => {

            const song = songs.find(
                (song) => song.id === trending.songId
            );
            if (!song) return null;
            return {
                ...song,
                playCount: trending._count.songId
            };
        }).filter((song) => song !== null) ;

        return res.status(200).json({
            message: "Trending songs found",
            rankedSongs
        });

    } catch (error) {
        console.error("Error in getPopularSongs controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}