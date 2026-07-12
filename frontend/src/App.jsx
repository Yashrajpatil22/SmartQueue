import {Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import QueueList from "./pages/QueueList";
import AddQueue from "./pages/AddQueue";
import QueueDetails from "./pages/QueueDetails";
import StaffList from "./pages/StaffList";
import AddStaff from "./pages/AddStaff";
import EditStaff from "./pages/EditStaff";
import TrackQueue from "./pages/TrackQueue";
import JoinQueue from "./pages/JoinQueue";
import './App.css'

function App() {
  return(
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/queue-list" element={
        <ProtectedRoute>
          <QueueList />
        </ProtectedRoute>
      } />
      <Route path="/add-queue" element={
        <ProtectedRoute>
          <AddQueue />
        </ProtectedRoute>
      } />
      <Route path="/queue/:id" element={
        <ProtectedRoute>
          <QueueDetails />
        </ProtectedRoute>
      } />
      <Route path="/staff-list" element={
        <ProtectedRoute>
          <StaffList />
        </ProtectedRoute>
      } />
      <Route path="/add-staff" element={
        <ProtectedRoute>
          <AddStaff />
        </ProtectedRoute>
      } />
      <Route path="/edit-staff/:id" element={
        <ProtectedRoute>
          <EditStaff />
        </ProtectedRoute>
      } />
      <Route path="/track-queue/:id" element={
        <ProtectedRoute>
          <TrackQueue />
        </ProtectedRoute>
      } />
      <Route path="/join-queue/:id" element={
        <ProtectedRoute>
          <JoinQueue />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App
