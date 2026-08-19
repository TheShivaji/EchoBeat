import { useRef, useState } from "react";
import axios from "axios";
import {
    searchPlaylistsAPI,
    searchArtistsAPI,
    searchSongsAPI,
    searchAlbumsAPI,
} from "../api/search.api";


import type { Artist } from "../../artists/types/artists.types";
import type { Album } from "../../album/types/album.types";
import type { Playlist } from "../../playlist/types/playlist.types";
import type { Song } from "../../song/types/song.type";


export const useSearch = () => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [songs, setSongs] = useState<Song[]>([]);
    const controllerRef = useRef<AbortController | null>(null);

    const [loading, setLoading] = useState({
        artists: false,
        albums: false,
        songs: false,
        playlists: false,
    });

    const [error, setError] = useState<string | null>(null);

    const handleSearchArtist = async (
        q: string,
        page: number = 1,
        limit: number = 20
    ) => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        try {
            setLoading((prev) => ({
                ...prev,
                artists: true,
            }));

            setError(null);

            const result = await searchArtistsAPI(q, page, limit, signal);

            if (result.success) {
                setArtists(result.artists);
            }
        } catch (error: any) {
            if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
                console.log('Request was cancelled:', error.message);
            }
            else {
                setError(
                    error?.response?.data?.message ||
                    "Failed to search songs"
                );
            }

            return error;
        } finally {
            setLoading((prev) => ({
                ...prev,
                artists: false,
            }));
        }
    };

    const handleSearchAlbum = async (
        q: string,
        page: number = 1,
        limit: number = 20
    ) => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        try {
            setLoading((prev) => ({
                ...prev,
                albums: true,
            }));

            setError(null);

            const result = await searchAlbumsAPI(q, page, limit, signal);

            if (result.success) {
                setAlbums(result.albums);
            }
        } catch (error: any) {
            if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
                console.log('Request was cancelled:', error.message);
            }
            else {
                setError(
                    error?.response?.data?.message ||
                    "Failed to search songs"
                );
            }


            return error;
        } finally {
            setLoading((prev) => ({
                ...prev,
                albums: false,
            }));
        }
    };

    const handleSearchSong = async (
        q: string,
        page: number = 1,
        limit: number = 20
    ) => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        try {
            setLoading((prev) => ({
                ...prev,
                songs: true,
            }));

            setError(null);

            const result = await searchSongsAPI(q, page, limit, signal);

            if (result.success) {
                setSongs(result.songs);
            }
        } catch (error: any) {
            if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
                console.log('Request was cancelled:', error.message);
            }
            else {
                setError(
                    error?.response?.data?.message ||
                    "Failed to search songs"
                );
            }

            return error;
        } finally {
            setLoading((prev) => ({
                ...prev,
                songs: false,
            }));
        }
    };

    const handleSearchPlaylist = async (
        q: string,
        page: number = 1,
        limit: number = 20
    ) => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        try {
            setLoading((prev) => ({
                ...prev,
                playlists: true,
            }));

            setError(null);

            const result = await searchPlaylistsAPI(q, page, limit, signal);

            if (result.success) {
                setPlaylists(result.playlists);
            }
        } catch (error: any) {
            if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
                console.log('Request was cancelled:', error.message);
            }
            else {
                setError(
                    error?.response?.data?.message ||
                    "Failed to search songs"
                );
            }

            return error;
        } finally {
            setLoading((prev) => ({
                ...prev,
                playlists: false,
            }));
        }
    };

    return {
        artists,
        albums,
        playlists,
        songs,

        loading,
        error,

        controllerRef,

        handleSearchArtist,
        handleSearchAlbum,
        handleSearchSong,
        handleSearchPlaylist,
    };
};