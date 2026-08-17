import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api/songs",
    withCredentials: true
})

export const songDetailsApi = async (id: string) => {

    const response = await api.get(`/get-song-details/${id}`);

    return response.data;
}

export const handleGetNewReleases = async (page: number = 1, limit: number = 20) => {
    const response = await api.get(`/new-releases?page=${page}&limit=${limit}`);
    return response.data;
}

export const handleGetLikedSongs = async () => {
    const response = await api.get("/liked-songs");
    return response.data;
}