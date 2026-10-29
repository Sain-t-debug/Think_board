import axios from "axios";

// In production the frontend is served by the same Express server,
// so a relative "/api" base URL is correct (and works behind any domain/proxy).
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080/api"
    : import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;