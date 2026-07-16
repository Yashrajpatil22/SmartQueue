import React, { useState } from "react";
// import axios from "axios";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import AlertBox from "../components/AlertBox";
import { Eye, EyeOff } from "lucide-react";

function AddStaff() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    message: "",
    type: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/api/staff/create",
        {
          name,
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );
      setAlert({
        message: response.data.message,
        type: "success",
      });
      navigate("/staff-list");
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || "Failed to add staff member.",
        type: "error",
      });
      console.log("Failed to add staff member:", err);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
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
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Add Staff
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter staff name"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
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

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            Add Staff
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStaff;
