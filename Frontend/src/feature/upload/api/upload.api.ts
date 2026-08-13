import axios from "axios";
import type { UploadSongData } from "../types/upload.type";

const api = axios.create({
    baseURL: "http://localhost:5000/api/songs",
    headers: {
        "Content-Type": "multipart/form-data",
    },
});

export const uploadSongApi = async (
    data: UploadSongData,
    onProgress?: (progress: number) => void
) => {
    const formData = new FormData();

    
formData.append("title", data.title);
    formData.append("artistId", data.artistId);
    formData.append("duration", data.duration.toString());
    formData.append("category", data.category);

    if (data.albumID) {
        formData.append("albumID", data.albumID);
    }

    formData.append("audioFile", data.audioFile);

    if (data.imageFile) {
        formData.append("imageFile", data.imageFile);
    }

    const response = await api.post("/upload", formData, {
        onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
            }
        },
    });

    return response.data
}
