import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AlertBox from "../components/AlertBox";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [alert, setAlert] = useState({
    message: "",
    type: "",
  });

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            withCredentials: true,
          },
        );
        setName(response.data.user.name);
        setEmail(response.data.user.email);
        setRole(response.data.user.role);
        setCreatedAt(response.data.user.createdAt);
      } catch (error) {
        setAlert({
          message: error.response?.data?.message || "Failed to fetch profile.",
          type: "error",
        });
        console.log("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);
  const navigate = useNavigate();
  const updateProfile = () => {
    try{
        const response = axios.put(
            `${import.meta.env.VITE_API_URL}/api/auth/update-profile`,
            { name, email },
            {
              withCredentials: true,
            }
        );
        console.log("Profile updated successfully:", response.data);
        setAlert({
            message: response.data.message,
            type: "success",
        });
        navigate("/profile");
    }
    catch(error){
      setAlert({
        message: error.response?.data?.message || "Failed to update profile.",
        type: "error",
      });
        console.log("Error updating profile:", error);
    }
    
  }

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
      <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          My Profile
        </h1>

        
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <input
              type="text"
              className="text-lg font-semibold border rounded-lg p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <input
              type="email"
              className="text-lg border rounded-lg p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Role</p>
            <p className="text-lg">{role}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Member Since</p>
            <p className="text-lg">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 cursor-pointer"
            onClick={updateProfile}
          >
            Update Profile
          </button>

        </div>
      </div>
    </div>
  );
}

export default Profile;
