import React, { useState, useEffect } from "react";
// import axios from "axios";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function StaffList() {
  const [staff, setStaff] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    
        const fetchStaff = async () => {
            try {
              const response = await api.get(
                `/api/staff`,
                {
                  withCredentials: true,
                },
              );
              setStaff(response.data.staff);
            } catch (err) {
              console.log("Failed to fetch staff data:", err);
            }
        
    }
    fetchStaff();
  }, []);

  const deleteStaff = async (staffId) => {
    try{
        const response = await api.delete(`/api/staff/${staffId}`, {
            withCredentials: true,
        });
        if(response.status === 200){
            setStaff(staff.filter(member => member._id !== staffId));
        }
    }catch(err){
        console.log("Failed to delete staff member:", err);
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        Staff Management
      </h1>

      <div className="w-full max-w-3xl space-y-4">
        {staff.map((member) => (
          <div
            key={member._id}
            className="bg-white border border-gray-200 rounded-2xl shadow p-5 flex justify-between items-center hover:border-blue-500 transition-colors duration-200"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {member.name}
              </h2>

              <p className="text-gray-600">{member.email}</p>

              <p className="text-sm text-gray-500">{member.role}</p>
            </div>

            <div className="flex gap-3">
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                onClick={() => navigate(`/edit-staff/${member._id}`)}
              >
                Edit
              </button>

              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg cursor-pointer"
              onClick={() => deleteStaff(member._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-2xl cursor-pointer transition-colors duration-200"
        onClick={() => navigate("/add-staff")}>
          Add Staff
        </button>
      </div>
    </div>
  );
}

export default StaffList;
