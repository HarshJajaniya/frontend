import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000",
    withCredentials: true,
});

export const getCurrentUser = async () => {
    try {
        const res = await api.get("/auth/me", {
            params: { _ts: Date.now() },
            headers: {
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
            },
        });
        return res.data;
    } catch {
        return null;
    }
};

export default api;
