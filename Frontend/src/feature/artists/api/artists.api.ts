import axios from "axios";
import type { UploadArtists } from "../types/artists.types";

const api = axios.create({
    baseURL: "http://localhost:5000/api/artists",
    withCredentials: true,
    headers: {
        "Content-Type": "multipart/form-data",
    },
})

export const uploadArtistApi = async (data: UploadArtists) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("bio", data.bio);
    formData.append("image", data.imageFile);

    const response = await api.post("/create-artist", formData);
    return response.data
}

export const getAllArtistsApi = async () => {
    const response = await api.get("/get-all-artists");
    return response.data
}