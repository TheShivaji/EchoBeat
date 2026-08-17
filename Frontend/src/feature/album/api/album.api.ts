import axios from "axios";
import type { Album } from "../types/album.types";

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

export const handleCreateAlbum = async (data: { title: string; artistId: string; releaseYear: number; imageFile: File | null }) => {

    const formdata = new FormData();
    
    formdata.append("title" , data.title)
    formdata.append("artistId" , data.artistId)
    formdata.append("releaseYear" , data.releaseYear.toString())
    
    if (data.imageFile) {
        formdata.append("imageFile" , data.imageFile)
    }

    const response = await api.post("/create-album", formdata);
    return response.data;
}