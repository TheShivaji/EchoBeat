import axios from "axios";
import type {
    AIPlaylistResponse,
    AILyricsResponse,
    AILyricsPayload,
    ChatRequest,
    ChatResponse,
} from "../types/ai.types";

// Re-export all types so existing imports don't break
export type {
    AIPlaylistSong,
    AIPlaylistData,
    AIPlaylistResponse,
    LyricsResult,
    AILyricsResponse,
    AILyricsPayload,
    ChatMessage,
    ChatRequest,
    ChatResponse,
} from "../types/ai.types";

const api = axios.create({
    baseURL: "/api/ai",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

// ─── AI Playlist ───────────────────────────────────────────────────────────────

export const generateAIPlaylistAPI = async (message: string): Promise<AIPlaylistResponse> => {
    const response = await api.post<AIPlaylistResponse>("/playlist", { message });
    return response.data;
};

// ─── AI Lyrics ─────────────────────────────────────────────────────────────────

export const getAILyricsAPI = async (payload: AILyricsPayload): Promise<AILyricsResponse> => {
    const response = await api.post<AILyricsResponse>("/lyrics", payload);
    return response.data;
};

// ─── Echo Chatbot Agent ────────────────────────────────────────────────────────

export const sendChatMessageAPI = async (payload: ChatRequest): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>("/assistant", payload);
    return response.data;
};
