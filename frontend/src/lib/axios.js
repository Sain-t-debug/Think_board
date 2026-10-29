import axios from "axios";
const BASR_URL = import.meta.env.MODE === "development" ? "http://localhost:8080/api" : api 
const api = axios.create({
    baseURL:BASR_URL,
})

export default api