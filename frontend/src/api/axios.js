import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api"
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Automatically attach the auth token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Handle 401 globally — clear storage and redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            // Only redirect if not already on auth pages
            if (!window.location.pathname.includes("/login") &&
                !window.location.pathname.includes("/register")) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;