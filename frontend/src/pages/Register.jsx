import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AlertBox from "../components/AlertBox";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [tenantName, setTenantName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [alert, setAlert] = React.useState({
    message: "",
    type: "",
  });
  const {login} = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        tenantName,
        phone,
        userName,
        email,
        password,
      },{
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
      setAlert({
        message: err.response?.data?.message || "Something went wrong.",
        type: "error",
      });
      console.error("Error occurred while registering:", err);
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
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 font-medium">Tenant Name</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your tenant name"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-medium">Phone Number</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 font-medium">Username</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

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
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full cursor-pointer"
            >
              Register
            </button>
          </div>
          <p className="mt-4 text-center text-gray-600">
            Already a user?{" "}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
