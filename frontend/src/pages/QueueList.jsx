import React, {useEffect, useState} from 'react'
// import axios from 'axios'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import AlertBox from '../components/AlertBox'

function QueueList() {
    const [queues, setQueues] = useState([]);
    const [alert, setAlert] = useState({ message: "", type: "" });
    const navigate = useNavigate();
    useEffect(() =>{
        const fetchQueues = async () => {
            try{
                const response = await api.get(
                  `/api/queue`,
                  {
                    withCredentials: true,
                  }
                );
                setQueues(response.data.queues);
            }catch(error){
              setAlert({
                message: error.response?.data?.message || "Failed to fetch queues.",
                type: "error",
              });
              console.log("Error fetching queues:", error);
            }
            
        }
        fetchQueues();
    }, [])

    const deleteQueue = async (queueId) => {
      if (!window.confirm("Are you sure you want to delete this queue?")) {
        return;
      }
      try{
        const response = await api.delete(
          `/api/queue/${queueId}`,
          {
            withCredentials: true,
          }
        );
        console.log("Delete Queue response:", response.data);
        setQueues(queues.filter(queue => queue._id !== queueId));
        setAlert({
          message: response.data.message,
          type: 'success',
        });
      }catch(error){
        setAlert({
          message: error.response?.data?.message || 'Failed to delete queue.',
          type: 'error',
        });
        console.log("Error deleting queue:", error);
      }
    }

    const handleCopyJoinLink = async (queueId) => {
      const joinLink = `${window.location.origin}/join-queue/${queueId}`;
      await navigator.clipboard.writeText(joinLink);
      setAlert({
        message: "Join link copied to clipboard!",
        type: "success",
      });
    }

  if (queues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          No Queues Found
        </h1>

        <p className="text-gray-600 mb-6">
          Create your first queue to get started.
        </p>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg"
          onClick={() => navigate("/add-queue")}
        >
          Add Queue
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
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
      <h1 className="text-3xl font-bold mb-4">Queues</h1>
      {queues.map((queue) => (
        <div
          key={queue._id}
          className="bg-white p-4 shadow mb-4 w-1/2 border border-gray-300 rounded-2xl hover:border-blue-500"
        >
          <div
            className="cursor-pointer"
            onClick={() => navigate(`/queue/${queue._id}`)}
          >
            <h2 className="text-xl font-semibold">{queue.name}</h2>
            <h2 className="text-lg text-gray-600">{queue.status}</h2>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200"
              onClick={() => handleCopyJoinLink(queue._id)}
            >
              Copy Join Link
            </button>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200"
              onClick={() => navigate(`/edit-queue/${queue._id}`)}
            >
              Edit
            </button>

            <button
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200"
              onClick={() => deleteQueue(queue._id)}
            >
              Delete
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200"
              onClick={() => navigate(`/customer-list/${queue._id}`)}
            >
              View Customers
            </button>
          </div>
        </div>
      ))}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        onClick={() => navigate("/add-queue")}
      >
        Add Queue
      </button>
    </div>
  );
}

export default QueueList