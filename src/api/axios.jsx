import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_API_URL;

if (!BASE_URL) {
    console.error("REACT_APP_API_URL no está definida en .env");
}

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});