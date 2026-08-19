import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api/search",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

export const searchArtistsAPI = async (q: string, page: number = 1, limit: number = 20 , signal : AbortSignal) => {
    try {
        const response = await api.get(`/artists?q=${q}&page=${page}&limit=${limit}` , {
            signal
        })
        return response.data;
    } catch (error) {
        return error;
    }
}

export const searchSongsAPI = async (q: string, page: number = 1, limit: number = 20 , signal : AbortSignal) => {
    try {
        const response = await api.get(`/songs?q=${q}&page=${page}&limit=${limit}` , {
            signal
        })
        return response.data;
    } catch (error) {
        return error;
    }
}

export const searchAlbumsAPI = async (q: string, page: number = 1, limit: number = 20 ,signal : AbortSignal) => {
    try {
        const response = await api.get(`/albums?q=${q}&page=${page}&limit=${limit}`, {
            signal
        })
        return response.data;
    } catch (error) {
        return error;
    }
}

export const searchPlaylistsAPI = async (q: string, page: number = 1, limit: number = 20 , signal : AbortSignal) => {
    try {
        const response = await api.get(`/playlists?q=${q}&page=${page}&limit=${limit}`, {
            signal
        })
        return response.data;
    } catch (error) {
        return error;
    }
}
