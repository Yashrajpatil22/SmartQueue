import {Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import QueueList from "./pages/QueueList";
import AddQueue from "./pages/AddQueue";
import QueueDetails from "./pages/QueueDetails";
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
    </Routes>
  )
}

export default App
