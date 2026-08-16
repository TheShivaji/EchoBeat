import { useState, useCallback } from "react";
import { handleGetNewReleases } from "../api/song.api";
import type { Song } from "../../home/types/home.types";

export const useNewReleases = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const getNewReleases = useCallback(async (pageNumber: number = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await handleGetNewReleases(pageNumber, 20);
            if (response.success) {
                setSongs(prev => pageNumber === 1 ? response.songs : [...prev, ...response.songs]);
                setHasMore(response.hasMore);
                setPage(pageNumber);
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to fetch new releases");
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            getNewReleases(page + 1);
        }
    }, [loading, hasMore, page, getNewReleases]);

    return { songs, loading, error, hasMore, loadMore, getNewReleases };
};
