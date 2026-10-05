import axios from "axios";

const api = axios.create({
    baseURL: "/api/home",
    withCredentials: true,
});

export const getHomeData = async () => {
    const response = await api.get("/");
    return response.data;
};