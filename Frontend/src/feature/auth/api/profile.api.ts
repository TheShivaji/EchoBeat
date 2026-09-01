import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api/user",
    withCredentials: true
});

export const updateProfileApi = async (data: FormData) => {
    try {
        const response = await api.put("/update-profile", data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const changePasswordApi = async (data: { currentPassword?: string; newPassword: string }) => {
    try {
        const response = await api.post("/change-password", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
