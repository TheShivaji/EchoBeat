import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api/album",
    withCredentials: true,
})

export const handleGetAllAlbums = async () => {
    const response = await api.get("/get-all-albums");
    return response.data;
}

export const handleGetAlbumDetails = async (id: string) => {
    const response = await api.get(`/get-album-details/${id}`);
    return response.data;
}