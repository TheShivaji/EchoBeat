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
    const requestIdRef = useRef(0);

    const cacheRef = useRef<Record<string, {
        data: any;
        timeStamp: number;
    }>>({});



    const [loading, setLoading] = useState({
        artists: false,
        albums: false,
        songs: false,
        playlists: false,
    });

    const [error, setError] = useState<string | null>(null);

    const handleControlAndReq = () => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        requestIdRef.current += 1;
        const requestId = requestIdRef.current;

        return {
            signal,
            requestId
        }
    }

    const catchError = (error: any, defaultMessage = "Failed to search") => {
        if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
            console.log('Request was cancelled:', error.message);
        }
        else {
            setError(
                error?.response?.data?.message ||
                defaultMessage
            );
        }

        return error;
    }



    const cachedFunction = (q: string, type: 'artists' | 'albums' | 'songs' | 'playlists') => {
        const key = `${type}:${q.trim().toLowerCase()}`;

        const cached = cacheRef.current[key];


        if (cached) {
            const now = Date.now();
            const expiryTime = cached.timeStamp + 30 * 60 * 1000;

            if (now < expiryTime) {
                return { key, isCached: true, data: cached.data };
            }
        }

        return { key, isCached: false, data: null };
    }

    const handleSearchArtist = async (
        q: string,
        page: number = 1,
        limit: number = 20
    ) => {

        const { signal, requestId } = handleControlAndReq()

        setLoading((prev) => ({
            ...prev,
            artists: true,
        }));

        setError(null);


        try {
            const cachedata = cachedFunction(q, 'artists');
            if (cachedata.isCached) {
                setArtists(cachedata.data.artists);
                return;
            }


            const result = await searchArtistsAPI(q, page, limit, signal);

            if (requestId !== requestIdRef.current) return;

            if (result.success) {
                setArtists(result.artists);

                cacheRef.current[cachedata.key] = {
                    data: result,
                    timeStamp: Date.now()
                };
            }
        } catch (error: any) {
            return catchError(error, "Failed to search artists");


        } finally {
            if (requestId === requestIdRef.current) {
                setLoading((prev) => ({
                    ...prev,
                    artists: false,
                }));
            }
        }
    };

    const handleSearchAlbum = async (
        q: string,
        page: number = 1,
        limit: number = 20
    ) => {
        const { signal, requestId } = handleControlAndReq()

        setLoading((prev) => ({
            ...prev,
            albums: true,
        }));

        setError(null);

        try {
            const cachedata = cachedFunction(q, 'albums');
            if (cachedata.isCached) {
                setAlbums(cachedata.data.albums);
                return;
            }

            const result = await searchAlbumsAPI(q, page, limit, signal);

            if (requestId !== requestIdRef.current) return;
            if (result.success) {
                setAlbums(result.albums);

                cacheRef.current[cachedata.key] = {
                    data: result,
                    timeStamp: Date.now()
                };
            }
        } catch (error: any) {
            return catchError(error, "Failed to search albums");


        } finally {
            if (requestId === requestIdRef.current) {
                setLoading((prev) => ({
                    ...prev,
                    albums: false,
                }));
            }
        }
    };

    const handleSearchSong = async (
        q: string,
        page: number = 1,
        limit: number = 20
    ) => {
        const { signal, requestId } = handleControlAndReq()

        setLoading((prev) => ({
            ...prev,
            songs: true,
        }));

        setError(null);

        try {
            const cachedata = cachedFunction(q, 'songs');
            if (cachedata.isCached) {
                setSongs(cachedata.data.songs);
                return;
            }

            const result = await searchSongsAPI(q, page, limit, signal);

            if (requestId !== requestIdRef.current) return;
            if (result.success) {
                setSongs(result.songs);

                cacheRef.current[cachedata.key] = {
                    data: result,
                    timeStamp: Date.now()
                };
            }
        } catch (error: any) {
            return catchError(error, "Failed to search songs");
        } finally {
            if (requestId === requestIdRef.current) {
                setLoading((prev) => ({
                    ...prev,
                    songs: false,
                }));
            }
        }
    };

    const handleSearchPlaylist = async (
        q: string,
        page: number = 1,
        limit: number = 20
    ) => {
        const { signal, requestId } = handleControlAndReq()

        setLoading((prev) => ({
            ...prev,
            playlists: true,
        }));

        setError(null);

        try {
            const cachedata = cachedFunction(q, 'playlists');
            if (cachedata.isCached) {
                setPlaylists(cachedata.data.playlists);
                return;
            }

            const result = await searchPlaylistsAPI(q, page, limit, signal);

            if (requestId !== requestIdRef.current) return;

            if (result.success) {
                setPlaylists(result.playlists);

                cacheRef.current[cachedata.key] = {
                    data: result,
                    timeStamp: Date.now()
                };
            }
        } catch (error: any) {
            return catchError(error, "Failed to search playlists");


        } finally {
            if (requestId === requestIdRef.current) {
                setLoading((prev) => ({
                    ...prev,
                    playlists: false,
                }));
            }
        }
    };

    return {
        artists,
        albums,
        playlists,
        songs,

        loading,
        error,



        handleSearchArtist,
        handleSearchAlbum,
        handleSearchSong,
        handleSearchPlaylist,
    };
};