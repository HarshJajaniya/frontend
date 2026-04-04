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

export default api;
