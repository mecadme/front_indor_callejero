import axios from "axios";

// Verifica si la variable de entorno está definida
const apiUrl = import.meta.env.VITE_APP_API_URL;
// process.env.REACT_APP_API_URL;

if (!apiUrl) {
    console.error("REACT_APP_API_URL no está definida en .env");
}
console.log(apiUrl);

const instance = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

// Opcional: puedes agregar interceptores para manejar respuestas o errores
instance.interceptors.response.use(
    response => response,
    error => {
        console.error("Error en la respuesta de la API:", error);
        return Promise.reject(error);
    }
);

export default instance;
