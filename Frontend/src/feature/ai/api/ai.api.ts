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

export interface LyricsResult {
    action: string;
    target_language?: string | null;
    translated_lyrics?: string | null;
    meaning_summary?: string | null;
    mood_and_vibe?: string | null;
    key_themes?: string[];
    poetic_breakdown?: string | null;
}

export interface AILyricsResponse {
    success: boolean;
    lyricsAvailable: boolean;
    song?: {
        id: string;
        title: string;
        artist: string;
        originalLyrics?: string;
    };
    result?: LyricsResult;
    message?: string;
}

export interface AILyricsPayload {
    songId: string;
    prompt?: string;
    action?: "translate" | "explain" | "mood" | "all";
    targetLanguage?: string;
}

export const getAILyricsAPI = async (payload: AILyricsPayload): Promise<AILyricsResponse> => {
    const response = await api.post<AILyricsResponse>("/lyrics", payload);
    return response.data;
};

