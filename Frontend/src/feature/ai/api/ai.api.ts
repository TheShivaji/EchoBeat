import axios from "axios";
import type { Song } from "../../song/types/song.type";

const api = axios.create({
    baseURL: "http://localhost:5000/api/ai",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

export interface AIPlaylistSong {
    id: string;
    title: string;
    artists: Song["artists"];
    album: Song["album"];
    duration: number;
    imageUrl: string;
    audioUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface AIPlaylistData {
    id: string;
    name: string;
    description: string;
    isPublic: boolean;
    imageUrl: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    songs?: AIPlaylistSong[];
}

export interface AIPlaylistResponse {
    success: boolean;
    playlist?: AIPlaylistData;
    source?: string;
    message?: string;
}

export const generateAIPlaylistAPI = async (message: string): Promise<AIPlaylistResponse> => {
    const response = await api.post<AIPlaylistResponse>("/playlist", { message });
    return response.data;
};
