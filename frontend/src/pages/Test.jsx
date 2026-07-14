import { useEffect } from "react";
import api from "../services/api";

function Test() {
  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await api.get("/api/auth/me");
        console.log(response.data);
      } catch (err) {
        console.log("Component Catch:", err.response?.status);
      }
    };

    testApi();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">Refresh Token Test</h1>
    </div>
  );
}

export default Test;
