import axios from "axios";
import refreshApi from "./refreshApi";
// import useAuth from "../context/AuthContext";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// const { logout } = useAuth();

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
        error.config._retry = true;
      console.log("Access token expired");

      try {
        const response = await refreshApi.post("/api/auth/refresh-token");

        console.log("Refresh successful");
        console.log(response.data);
        return api(error.config);
      } catch (refreshError) {
        console.log("Refresh failed");
        // logout();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
