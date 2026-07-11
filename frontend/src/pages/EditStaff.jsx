import React, { useState, useEffect } from "react";
import axios from "axios";
// import { useParams } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";

function EditStaff() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {id} = useParams();

  useEffect(() => {
    const fetchStaffDetails = async () => {
        try{
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/staff/${id}`,
                 {
                withCredentials: true,
            });
            console.log(response);
            setName(response.data.staff.name);
            setEmail(response.data.staff.email);
            // setPassword(response.data.password);
        }catch(err){
            console.log("Failed to fetch staff details:", err);
        }
    }
    fetchStaffDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/staff/${id}`,
        {
          name,
          email,
        //   password,
        },
        {
          withCredentials: true,
        },
      );
      navigate("/staff-list");
    } catch (err) {
      console.log("Failed to edit staff member:", err);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
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
