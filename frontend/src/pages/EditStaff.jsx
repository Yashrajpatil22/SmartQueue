import React, { useState, useEffect } from "react";
// import axios from "axios";
import api from "../services/api";
// import { useParams } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import AlertBox from "../components/AlertBox";
// import { Eye, EyeOff } from "lucide-react";

function EditStaff() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({
    message: "",
    type: "",
  });
  // const [showPassword, setShowPassword] = useState(false);
//   const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {id} = useParams();

  useEffect(() => {
    const fetchStaffDetails = async () => {
        try{
            const response = await api.get(`/api/staff/${id}`, {
                withCredentials: true,
            });
            console.log(response);
            setName(response.data.staff.name);
            setEmail(response.data.staff.email);
            // setPassword(response.data.password);
        }catch(err){
          setAlert({
            message: err.response?.data?.message || "Failed to fetch staff details.",
            type: "error",
          });
            console.log("Failed to fetch staff details:", err);
        }
    }
    fetchStaffDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(
        `/api/staff/${id}`,
        {
          name,
          email,
        //   password,
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
        message: err.response?.data?.message || "Failed to edit staff member.",
        type: "error",
      });
      console.log("Failed to edit staff member:", err);
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
          Edit Staff
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

          {/* <div>
            <label className="block mb-2 font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div> */}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            Edit Staff
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditStaff;
