import { useState } from "react";
import toast from "react-hot-toast";

import { getAllArtistsApi, uploadArtistApi } from "../api/artists.api";
import type { UploadArtists, Artist } from "../types/artists.types";

export const useArtists = () => {
   const [artists, setArtists] = useState<Artist[]>([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUploadArtist = async (data: UploadArtists) => {
        try {
            setLoading(true);
            setError(null);

            const result = await uploadArtistApi(data);

            if (!result.success) {
                setError(result.message);
                toast.error(result.message);
                return null;
            }
            return result;
        } catch (error) {
            console.error("Error uploading artist:", error);

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to upload artist";

            setError(errorMessage);
            toast.error(errorMessage);

            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleGetAllArtist = async()=>{
        try {
            setLoading(true);
            setError(null);

            const result = await getAllArtistsApi();

            if (result && result.artists) {
               setArtists(result.artists)
            }
            return result;
        } catch (error) {
            console.error("Error getting artists:", error);

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to get artists";

            setError(errorMessage);
            toast.error(errorMessage);

            return null;
        } finally {
            setLoading(false);
        }
    }

    return {
        artists,
        handleGetAllArtist,
        handleUploadArtist,
        loading,
        error,
    };
};