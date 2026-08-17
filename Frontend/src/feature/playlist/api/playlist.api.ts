import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:5000/api/playlist",
    withCredentials: true
});

export const handleGetUserPlaylists = async () => {
    const response = await api.get("/my-playlists");
    return response.data;
}

export const handleCreatePlaylist = async (data: { name: string; description: string; isPublic: boolean; imageFile: File | null }) => {
    const formdata = new FormData();
    
    formdata.append("name", data.name);
    formdata.append("description", data.description);
    formdata.append("isPublic", data.isPublic.toString());
    
    if (data.imageFile) {
        formdata.append("imageFile", data.imageFile);
    }

    const response = await api.post("/create", formdata);
    return response.data;
}

export const handleGetPlaylistDetails = async (id: string) => {
    const response = await api.get(`/${id}`);
    return response.data;
}
