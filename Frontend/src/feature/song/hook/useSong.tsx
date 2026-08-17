import { useState, useCallback } from "react";
import { songDetailsApi, handleGetLikedSongs } from "../api/song.api";
import type { Song } from "../types/song.type";


export const useSong = () => {
    const [song, setsong] = useState<Song | null>(null)
    const [likedSongs, setLikedSongs] = useState<Song[]>([])
    const [loading, setloading] = useState<boolean>(false)
    const [error, seterror] = useState<null | string>(null)
    
    const getSongDetails = useCallback(async (id: string) => {
        try {
            seterror(null)
            setloading(true)

            const data = await songDetailsApi(id)
            
            if (data.success) {
                setsong({
                    ...data.song,
                    isLiked: data.isLiked,
                    likeCount: data.likeCount
                })
            } else {
                seterror(data.message || "Failed to fetch song details")
            }

        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch song details";
            seterror(errorMessage)
        } finally {
            setloading(false)
        }
    }, []);
    const getLikedSongs = useCallback(async () => {
        try {
            seterror(null)
            setloading(true)
            const data = await handleGetLikedSongs()
            
            // Backend might return { songs: [...] } or { likedSongs: [...] } or just an array.
            // Adjust based on common patterns. Usually it's data.songs or data.likedSongs.
            if (data && data.likedSongs) {
                // If backend returns relation array like { song: Song }[]
                const normalized = data.likedSongs.map((item: any) => item.song ? item.song : item);
                setLikedSongs(normalized)
            } else if (Array.isArray(data)) {
                const normalized = data.map((item: any) => item.song ? item.song : item);
                setLikedSongs(normalized)
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch liked songs";
            seterror(errorMessage)
        } finally {
            setloading(false)
        }
    }, []);
    
    return { song, likedSongs, loading, error, getSongDetails, getLikedSongs }
}