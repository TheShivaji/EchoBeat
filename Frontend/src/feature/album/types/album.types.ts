// You can import Song and Artist types from their respective feature folders if you want to reuse them,
// but for simplicity and self-containment in the album feature, we can define them here or import them.
import type { Song } from "../../song/types/song.type";
import type { Artist } from "../../artists/types/artists.types";

export interface Album {
    id: string;
    title: string;
    imageUrl: string;
    releaseYear: number | null;
    createdAt: string;
    updatedAt: string;
    
    // According to the backend controller, 'songs' and 'artists' are included
    songs?: Song[];
    artists?: Artist[];
}

export interface GetAllAlbumsResponse {
    message: string;
    albums: Album[];
}

export interface GetAlbumDetailsResponse {
    message: string;
    album: Album;
}