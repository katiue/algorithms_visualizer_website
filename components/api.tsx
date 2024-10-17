import axios from "axios";

const api = axios.create({
    baseURL: "https://fast-api-algorithms.vercel.app",
});

export default api;