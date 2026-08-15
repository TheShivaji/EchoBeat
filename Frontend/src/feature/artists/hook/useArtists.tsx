import { useState } from "react";
import toast from "react-hot-toast";

import { getAllArtistsApi, getArtistDetails, uploadArtistApi, getArtistSongsApi, getArtistAlbumsApi } from "../api/artists.api";
import type { UploadArtists, Artist } from "../types/artists.types";

export const useArtists = () => {
    const [artists, setArtists] = useState<Artist[]>([])
    const [artist, setartist] = useState<Artist | null>(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [artistSongs, setArtistSongs] = useState<any[]>([]);
    const [songsPagination, setSongsPagination] = useState<any>(null);
    const [artistAlbums, setArtistAlbums] = useState<any[]>([]);
    const [albumsPagination, setAlbumsPagination] = useState<any>(null);

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
        } catch (error: any) {
            console.error("Error uploading artist:", error);

            const errorMessage = 
                error.response?.data?.message || 
                (error instanceof Error ? error.message : "Failed to upload artist");

            setError(errorMessage);
            toast.error(errorMessage);

            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleGetAllArtist = async () => {
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

    const getArtistDeatils = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const result = await getArtistDetails(id);

            if (result && result.artist) {
                setartist(result.artist)
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
    

    const getArtistSongs = async (id: string, page = 1, limit = 10) => {
        try {
            setLoading(true);
            setError(null);
            const result = await getArtistSongsApi(id, page, limit);
            if (result && result.songs) {
                setArtistSongs(result.songs);
                setSongsPagination(result.pagination);
            }
            return result;
        } catch (error: any) {
            console.error("Error getting artist songs:", error);
            // 404 means no songs, don't show toast error just set empty
            if (error.response?.status === 404) {
                setArtistSongs([]);
                setSongsPagination(null);
                return null;
            }
            const errorMessage = error.response?.data?.message || "Failed to get artist songs";
            setError(errorMessage);
            toast.error(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getArtistAlbums = async (id: string, page = 1, limit = 10) => {
        try {
            setLoading(true);
            setError(null);
            const result = await getArtistAlbumsApi(id, page, limit);
            if (result && result.albums) {
                setArtistAlbums(result.albums);
                setAlbumsPagination(result.pagination);
            }
            return result;
        } catch (error: any) {
            console.error("Error getting artist albums:", error);
            if (error.response?.status === 404) {
                setArtistAlbums([]);
                setAlbumsPagination(null);
                return null;
            }
            const errorMessage = error.response?.data?.message || "Failed to get artist albums";
            setError(errorMessage);
            toast.error(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        artists,
        handleGetAllArtist,
        handleUploadArtist,
        getArtistDeatils,
        getArtistSongs,
        getArtistAlbums,
        artist,
        artistSongs,
        songsPagination,
        artistAlbums,
        albumsPagination,
        loading,
        error,
    };
};