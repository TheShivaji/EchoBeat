import { prisma } from "../config/db.js";

// ─── Popular Artists 

export const getPopularArtists = async () => {
    // Get all played songs with their total play count
    const popularSongs = await prisma.playHistory.groupBy({
        by: ["songId"],
        _count: {
            songId: true
        }
    });

    const songIds = popularSongs.map((item) => item.songId);

    // Fetch only active songs with active artists
    const songs = await prisma.song.findMany({
        where: {
            id: {
                in: songIds
            },
            isDeleted: false,
            artists: {
                none: {
                    isDeleted: true
                }
            }
        },
        include: {
            artists: {
                where: {
                    isDeleted: false
                }
            }
        }
    });

    // Map songId -> playCount
    const songPlayCount = new Map<string, number>();

    for (const item of popularSongs) {
        songPlayCount.set(
            item.songId,
            item._count.songId
        );
    }

    // Map artistId -> total playCount
    const artistPlayCount = new Map<string, number>();

    for (const song of songs) {
        const plays = songPlayCount.get(song.id) ?? 0;

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

    // Fetch artist details
    const artists = await prisma.artist.findMany({
        where: {
            id: {
                in: artistIds
            },
            isDeleted: false
        }
    });

    // Attach playCount, sort and take top 10
    const popularArtists = artists
        .map((artist) => ({
            ...artist,
            playCount: artistPlayCount.get(artist.id) ?? 0
        }))
        .sort((a, b) => b.playCount - a.playCount)
        .slice(0, 10);

    return popularArtists;
};


// ─── Trending Songs 
export const getTrendingSongs = async () => {
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(
        sevenDaysAgo.getDate() - 7
    );

    // Get top 10 played songs from the last 7 days
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

    const songIds = trendingSongs.map(
        (item) => item.songId
    );

    // Fetch only active songs with active artists
    const songs = await prisma.song.findMany({
        where: {
            id: {
                in: songIds
            },
            isDeleted: false,
            artists: {
                none: {
                    isDeleted: true
                }
            }
        },
        include: {
            artists: {
                where: {
                    isDeleted: false
                }
            }
        }
    });

    // Preserve the ranking from groupBy result
    const rankedSongs = trendingSongs
        .map((trending) => {
            const song = songs.find(
                (song) => song.id === trending.songId
            );

            if (!song) {
                return null;
            }

            return {
                ...song,
                playCount: trending._count.songId
            };
        })
        .filter(
            (song): song is NonNullable<typeof song> =>
                song !== null
        );

    return rankedSongs;
};


// ─── New Releases 

export const getNewReleases = async () => {
    const newReleases = await prisma.song.findMany({
        where: {
            isDeleted: false,

            // If even one artist is deleted,
            // don't return the song
            artists: {
                none: {
                    isDeleted: true
                }
            }
        },

        include: {
            artists: {
                where: {
                    isDeleted: false
                }
            }
        },

        orderBy: {
            releasedDate: "desc"
        },

        take: 10
    });

    return newReleases;
};


// ─── Recently Played 

export const getRecentlyPlayed = async (
    userId: string,
    page: number = 1,
    limit: number = 20
) => {
    if (page < 1 || limit < 1) {
        throw new Error(
            "Invalid pagination params"
        );
    }

    const skip = (page - 1) * limit;

    const recentlyPlayed =
        await prisma.playHistory.findMany({
            where: {
                userId
            },

            orderBy: {
                playedAt: "desc"
            },

            skip,
            take: limit,

            include: {
                song: {
                    include: {
                        artists: {
                            where: {
                                isDeleted: false
                            }
                        },
                        album: true
                    }
                }
            }
        });

    return recentlyPlayed;
};