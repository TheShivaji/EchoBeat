import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api/home",
    withCredentials: true,
});

export const getHomeData = async () => {
    const response = await api.get("/");
    return response.data;
};