import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateAIPlaylistAPI } from "../api/ai.api";

interface SuccessInfo {
    id: string;
    name: string;
    count: number;
}

const MAX_PROMPT_LENGTH = 300;

export const useAIPlaylist = () => {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successInfo, setSuccessInfo] = useState<SuccessInfo | null>(null);
    const navigate = useNavigate();

    const handleGenerate = async () => {
        const trimmedPrompt = prompt.trim();

        if (!trimmedPrompt) {
            setError("Please describe the playlist you want to create.");
            return;
        }

        if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
            setError("Prompt is too long. Please keep it under 300 characters.");
            return;
        }

        setError(null);
        setSuccessInfo(null);
        setLoading(true);

        try {
            const response = await generateAIPlaylistAPI(trimmedPrompt);

            if (!response.success || !response.playlist) {
                setError(response.message || "Couldn't create the playlist. Please try again.");
                return;
            }

            const { playlist } = response;
            const songCount = playlist.songs?.length ?? 0;

            setSuccessInfo({ id: playlist.id, name: playlist.name, count: songCount });

            // Brief success flash, then navigate to the real playlist page
            setTimeout(() => {
                navigate(`/playlist/${playlist.id}`);
            }, 1500);
        } catch (err: any) {
            const msg: string = err?.response?.data?.message ?? "";

            if (
                msg.toLowerCase().includes("no matching songs") ||
                msg.toLowerCase().includes("no songs found")
            ) {
                setError("No matching songs were found for this playlist.");
            } else if (
                err?.code === "ERR_NETWORK" ||
                err?.code === "ECONNREFUSED"
            ) {
                setError("Couldn't connect to the server. Please check your connection.");
            } else if (err?.response?.status === 401) {
                setError("You need to be signed in to create a playlist.");
            } else {
                setError(msg || "Couldn't create the playlist. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);

    return {
        prompt,
        setPrompt,
        loading,
        error,
        successInfo,
        maxLength: MAX_PROMPT_LENGTH,
        handleGenerate,
        clearError,
    };
};
