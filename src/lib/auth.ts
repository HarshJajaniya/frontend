import axios from "axios";

const SERVER_URL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.NODE_ENV === "production"
        ? "https://meetmom-backend.onrender.com"
        : "http://localhost:8000");

const api = axios.create({
    baseURL: SERVER_URL,
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
