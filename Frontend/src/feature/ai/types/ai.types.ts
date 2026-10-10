// ─── AI Playlist Types ─────────────────────────────────────────────────────────

import type { Song } from "../../song/types/song.type";

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

// ─── AI Lyrics Types ───────────────────────────────────────────────────────────

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

// ─── Echo Chatbot Agent Types ──────────────────────────────────────────────────

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: number;
}

export interface ChatRequest {
    message: string;
    user_id?: string;
}

export interface ChatResponse {
    reply: string;
    playlist?: {
        id: string;
        name: string;
        description: string;
        imageUrl: string;
    } | null;
    play_song?: Song | null;
}
