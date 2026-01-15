import axios, { AxiosInstance } from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const http: AxiosInstance = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
	},
});

http.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Response interceptor untuk menangani error 401 (Unauthorized)
http.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Token tidak valid atau expired
			localStorage.removeItem("token");
			// Redirect ke halaman login
			if (typeof window !== "undefined") {
				window.location.href = "/auth/login/domain";
			}
		}
		return Promise.reject(error);
	}
);

export default http;
