import axios from "axios";
import refreshApi from "./refreshApi";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

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
      }
    }

    return Promise.reject(error);
  },
);

export default api;
