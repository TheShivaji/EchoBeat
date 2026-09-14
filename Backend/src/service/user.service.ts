import { prisma } from "../config/db.js";



export interface UserSong {
    id: string;
    title: string;
    artist: string;
    category: string | null;
}

export interface UserPlaylist {
    id: string;
    name: string;
    description: string | null;
}


export const getUserLikedSongs = async (userId: string, limit = 50): Promise<UserSong[]> => {
    const records = await prisma.likedSong.findMany({
        where: { userId },
        include: {
            song: {
                include: {
                    artists: { where: { isDeleted: false }, select: { name: true } },
                },
            },
        },
        take: limit,
    });

    return records.map((r: any) => ({
        id: r.song.id,
        title: r.song.title,
        artist: r.song.artists?.[0]?.name ?? "Unknown Artist",
        category: r.song.category ?? null,
    }));
};


export const getUserPlaylists = async (userId: string, limit = 20): Promise<UserPlaylist[]> => {
    const records = await prisma.playlist.findMany({
        where: { userId },
        select: { id: true, name: true, description: true },
        take: limit,
    });

    return records.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description ?? null,
    }));
};


export const getUserRecentlyPlayed = async (userId: string, limit = 20): Promise<UserSong[]> => {
    const records = await prisma.playHistory.findMany({
        where: { userId },
        include: {
            song: {
                include: {
                    artists: { where: { isDeleted: false }, select: { name: true } },
                },
            },
        },
        orderBy: { playedAt: "desc" },
        take: limit,
    });

    return records.map((h: any) => ({
        id: h.song.id,
        title: h.song.title,
        artist: h.song.artists?.[0]?.name ?? "Unknown Artist",
        category: h.song.category ?? null,
    }));
};
