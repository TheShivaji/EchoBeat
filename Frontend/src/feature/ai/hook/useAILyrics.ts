import { useState, useCallback } from "react";
import { getAILyricsAPI, type AILyricsResponse, type AILyricsPayload } from "../api/ai.api";

export type LyricsTab = "original" | "translated" | "meaning" | "mood";

export const useAILyrics = (songId?: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<AILyricsResponse | null>(null);
    const [activeTab, setActiveTab] = useState<LyricsTab>("original");
    const [prompt, setPrompt] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("Hindi");

    const fetchLyricsAI = useCallback(
        async (options?: Partial<AILyricsPayload>) => {
            if (!songId) return;

            setLoading(true);
            setError(null);

            try {
                const action = options?.action || "explain";
                const lang = options?.targetLanguage || targetLanguage;
                const userPrompt = options?.prompt ?? (prompt.trim() ? prompt.trim() : undefined);

                const response = await getAILyricsAPI({
                    songId,
                    action,
                    targetLanguage: lang,
                    prompt: userPrompt,
                });

                setData(response);

                // Automatically switch to the relevant tab if data is returned
                if (response.lyricsAvailable && response.result) {
                    if (action === "translate" && response.result.translated_lyrics) {
                        setActiveTab("translated");
                    } else if (action === "mood" && response.result.mood_and_vibe) {
                        setActiveTab("mood");
                    } else if (response.result.meaning_summary) {
                        setActiveTab("meaning");
                    } else if (response.result.translated_lyrics) {
                        setActiveTab("translated");
                    }
                }
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Couldn't process the lyrics right now. Please try again.";
                setError(message);
            } finally {
                setLoading(false);
            }
        },
        [songId, prompt, targetLanguage]
    );

    const translateToHindi = useCallback(() => {
        setTargetLanguage("Hindi");
        return fetchLyricsAI({ action: "translate", targetLanguage: "Hindi" });
    }, [fetchLyricsAI]);

    const translateToEnglish = useCallback(() => {
        setTargetLanguage("English");
        return fetchLyricsAI({ action: "translate", targetLanguage: "English" });
    }, [fetchLyricsAI]);

    const explainMeaning = useCallback(() => {
        return fetchLyricsAI({ action: "explain" });
    }, [fetchLyricsAI]);

    const explainMood = useCallback(() => {
        return fetchLyricsAI({ action: "mood" });
    }, [fetchLyricsAI]);

    const submitCustomPrompt = useCallback(() => {
        if (!prompt.trim()) return;
        return fetchLyricsAI({ action: "all", prompt: prompt.trim() });
    }, [fetchLyricsAI, prompt]);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setPrompt("");
        setActiveTab("original");
    }, []);

    return {
        loading,
        error,
        data,
        activeTab,
        setActiveTab,
        prompt,
        setPrompt,
        targetLanguage,
        setTargetLanguage,
        fetchLyricsAI,
        translateToHindi,
        translateToEnglish,
        explainMeaning,
        explainMood,
        submitCustomPrompt,
        reset,
    };
};
