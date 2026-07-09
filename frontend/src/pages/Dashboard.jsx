import React from 'react';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div className = "relative bg-gray-100 min-h-screen flex flex-col items-center justify-center gap-6">
      <div>
        <button className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded cursor-pointer" onClick={logout}>Logout</button>
      </div>
      <div className=" flex flex-col items-center justify-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SmartQueue</h1>
        </div>
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
        </div>
        <div className="grid grid-cols-2 gap-4 p-8 border rounded-2xl w-96 shadow-lg bg-white border-gray-200">
          <div className="border rounded-lg p-4 bg-white-100 hover:border-blue-500 cursor-pointer transition duration-300">
            <h1 className="text-lg font-semibold">Manage Queue</h1>
          </div>
          <div className="border rounded-lg p-4 bg-white-100 hover:border-blue-500 cursor-pointer transition duration-300">
            <h1 className="text-lg font-semibold">Manage Staff</h1>
          </div>
          <div className="border rounded-lg p-4 bg-white-100 hover:border-blue-500 cursor-pointer transition duration-300">
            <h1 className="text-lg font-semibold">Analytics</h1>
          </div>
          <div className="border rounded-lg p-4 bg-white-100 hover:border-blue-500 cursor-pointer transition duration-300">
            <h1 className="text-lg font-semibold">Profile</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard