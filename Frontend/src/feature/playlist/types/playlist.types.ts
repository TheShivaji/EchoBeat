import type { Song } from "../../song/types/song.type";

export interface Playlist {
    id: string;
    name: string;
    description: string;
    isPublic: boolean;
    imageUrl: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    songs?: { song: Song }[] | Song[]; // Based on typical Prisma many-to-many or related structures.
}
