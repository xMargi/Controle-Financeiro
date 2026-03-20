import axios from "axios";

export const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 1000,
})

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }

    return config
})