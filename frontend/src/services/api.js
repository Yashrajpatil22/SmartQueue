import axios from "axios";
import refreshApi from "./refreshApi";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const { logout } = useAuth();

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    
    if (
      error.config.url === "/api/auth/login" ||
      error.config.url === "/api/auth/register"
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;

      console.log("Access token expired");

      try {
        await refreshApi.post("/api/auth/refresh-token");

        console.log("Refresh successful");

        return api(error.config);
      } catch (refreshError) {
        console.log("Refresh failed");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
