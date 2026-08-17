import { uploadSongApi } from "../api/upload.api";
import { useState, useCallback } from "react";
import type { UploadSongData } from "../types/upload.type";


export const handleupload = () => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [uploadprogres, setUploadprogress] = useState(0)

    const uploadSong = useCallback(async (data: UploadSongData) => {
        try {
            setLoading(true)
            setError(null)
            setUploadprogress(0)
            const response = await uploadSongApi(data, (progress) => {
                setUploadprogress(progress);
            })
            
            return response
        } catch (error) {
            setUploadprogress(0)
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to upload song";
            setError(errorMessage)
        } finally {
            setLoading(false)
            setUploadprogress(0)
        }
    }, []);


    return {
        uploadSong,
        loading,
        error,
        uploadprogres
    }

}