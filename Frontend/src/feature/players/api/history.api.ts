import axios from "axios";

const api = axios.create({
    baseURL: "/api/history",
    withCredentials: true
});

export const recordPlayHistory = async (songId: string) => {
    try {
        const response = await api.post(`/play`, { songId });
        return response.data;
    } catch (error) {
        console.error("Failed to record play history:", error);
    }
};
