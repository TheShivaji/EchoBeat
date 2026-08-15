import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api/songs",
    withCredentials: true
})

export const songDetailsApi = async (id: string) => {

    const response = await api.get(`/get-song-details/${id}`);

    return response.data;
}