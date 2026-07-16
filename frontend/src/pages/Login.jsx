import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import AlertBox from "../components/AlertBox";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const {login} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({
    message: "",
    type: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await api.post("/api/auth/login", {
      email,
      password,
    },
  {
    withCredentials: true,
  });
    console.log(response.data.registeredUser);
    login(response.data.registeredUser);
    setAlert({
      message: response.data.message,
      type: "success",
    });

    navigate("/dashboard");
    }catch(err){
      console.error(err);
      setAlert({
        message: err.response?.data?.message || "Something went wrong.",
        type: "error",
      });
    }
  }
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen bg-gray-100">
      <AlertBox
        message={alert.message}
        type={alert.type}
        onClose={() =>
          setAlert({
            message: "",
            type: "",
          })
        }
      />
      <h1 className="text-3xl font-bold text-gray-900">SmartQueue</h1>
      <div className="p-8 border rounded-2xl w-96 shadow-lg bg-white border-gray-200">
        <h2 className="text-2xl font-bold mb-5 text-center text-gray-900">
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full cursor-pointer"
            >
              Login
            </button>
          </div>
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register as Manager
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
