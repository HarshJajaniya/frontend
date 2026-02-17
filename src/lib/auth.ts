import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
});

export const getCurrentUser = async () => {
    try {
        const res = await api.get("/auth/me");
        return res.data;
    } catch {
        return null;
    }
};

export default api;
