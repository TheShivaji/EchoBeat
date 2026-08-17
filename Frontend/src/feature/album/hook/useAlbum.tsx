import { useState, useCallback } from "react";
import { handleCreateAlbum, handleGetAlbumDetails, handleGetAllAlbums } from "../api/album.api";
import type { Album } from "../types/album.types";

export const useAlbum = () => {
    const [allAlbums, setAllAlbums] = useState<Album[]>([]);
    const [album, setAlbum] = useState<Album | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getAllAlbums = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await handleGetAllAlbums();

            if (response && response.albums) {
                setAllAlbums(response.albums);
            }
            return response;
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to fetch albums");
            return err;
        } finally {
            setLoading(false);
        }
    }, [])

    const getAlbumDetails = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await handleGetAlbumDetails(id);
            if (response && response.album) {
                setAlbum(response.album);
            }
            return response;
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to fetch album details");
            return err;
        } finally {
            setLoading(false);
        }
    }, [])

    const createAlbum = useCallback(async (data: { title: string; artistId: string; releaseYear: number; imageFile: File | null }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await handleCreateAlbum(data);
            return response;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create album");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        allAlbums,
        album,
        loading,
        error,
        getAllAlbums,
        getAlbumDetails,
        createAlbum
    };
};