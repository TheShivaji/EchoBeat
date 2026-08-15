import { useState } from "react";
import { songDetailsApi } from "../api/song.api";
import type { Song } from "../types/song.type";


export const useSong = () => {
    const [song, setsong] = useState<Song | null>(null)
    const [loading, setloading] = useState<boolean>(false)
    const [error, seterror] = useState<null | string>(null)
    
    const getSongDetails = async (id: string) => {
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
    }
    
    return { song, loading, error, getSongDetails }
}