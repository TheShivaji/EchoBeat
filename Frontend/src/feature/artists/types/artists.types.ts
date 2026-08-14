export interface UploadArtists {
    name: string;
    bio: string;
    imageFile: File;
}

export interface Artist {
    id: string;
    name: string;
    imageUrl?: string | null;
    bio?: string;
    isDeleted?: boolean;
}

