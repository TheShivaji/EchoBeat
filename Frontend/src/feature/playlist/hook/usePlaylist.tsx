import { useState, useCallback } from "react";
import { handleGetUserPlaylists, handleCreatePlaylist, handleGetPlaylistDetails } from "../api/playlist.api";
import type { Playlist } from "../types/playlist.types";

export const usePlaylist = () => {
    const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getUserPlaylists = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await handleGetUserPlaylists();
            if (response && response.playlists) {
                setUserPlaylists(response.playlists);
            }
            return response;
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to fetch playlists");
            return err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createPlaylist = useCallback(async (data: { name: string; description: string; isPublic: boolean; imageFile: File | null }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await handleCreatePlaylist(data);
            return response;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create playlist");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getPlaylistDetails = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await handleGetPlaylistDetails(id);
            if (response && response.playlist) {
                setPlaylist(response.playlist);
            }
            return response;
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to fetch playlist details");
            return err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        userPlaylists,
        playlist,
        loading,
        error,
        getUserPlaylists,
        createPlaylist,
        getPlaylistDetails
    };
};
