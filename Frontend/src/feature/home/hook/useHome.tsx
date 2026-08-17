import { useState, useCallback, useEffect } from "react";
import { getHomeData } from "../api/home.api";

import type { HomeData } from "../types/home.types";

export const useHome = () => {
    const [homeData, setHomeData] = useState<HomeData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHomeData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getHomeData();

            setHomeData(data);
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch home data";

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHomeData();
    }, []);

    return {
        homeData,
        loading,
        error,
        refetch: fetchHomeData,
    };
};