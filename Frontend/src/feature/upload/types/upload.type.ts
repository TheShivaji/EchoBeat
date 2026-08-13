export interface UploadSongData {
    title: string;
    artistId: string;
    duration: number;
    category?: string;
    albumID?: string;
    audioFile: File;
    imageFile?: File;
}