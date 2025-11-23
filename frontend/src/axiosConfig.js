import axios from "axios";

const axiosInstance = axios.create({
  // The Base URL from your Render Deployment
  baseURL: "https://lost-and-found-app-vp10.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- INTERCEPTOR ---
// Automatically adds the token to every request if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;