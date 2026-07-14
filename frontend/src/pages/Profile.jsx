import React, {useState, useEffect} from 'react'
// import axios from 'axios'
import api from '../services/api'
import {useNavigate} from 'react-router-dom'

function Profile() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [createdAt, setCreatedAt] = useState('');

    useEffect(() => {
        // Fetch user profile data
        const fetchProfile = async () => {
            try{
                const response = await api.get(`/api/auth/me`, {
                    withCredentials: true,
                });
                setName(response.data.user.name);
                setEmail(response.data.user.email);
                setRole(response.data.user.role);
                setCreatedAt(response.data.user.createdAt);
            }catch(error){
                console.log("Error fetching profile:", error);
            }
        }
        fetchProfile();
    }, []);
    const navigate = useNavigate();
    


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          My Profile
        </h1>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-lg font-semibold">{name}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-lg">{email}</p>
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
            onClick={() => navigate('/update-profile')}
          >
            Update Profile
          </button>

        </div>
      </div>
    </div>
  );
}

export default Profile