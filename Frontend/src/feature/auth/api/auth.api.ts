import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api/user",
    withCredentials: true
})

export const loginApi = async (user: { email: string, password: string }) => {
    const response = await api.post("/login", user)
    return response?.data
}
export const registerApi = async (user: { name: string, email: string, password: string }) => {
    const response = await api.post("/signup", user)
    return response?.data
}
export const getCurrentUser = async () => {
    const response = await api.get("/me")
    return response?.data
}