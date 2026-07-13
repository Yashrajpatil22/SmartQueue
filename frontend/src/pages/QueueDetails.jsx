import React,{useEffect} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import socket from '../services/socket'

function QueueDetails() {
    const {id} = useParams();
    const[name, setName] = React.useState('');
    const[description, setDescription] = React.useState('');
    const[status, setStatus] = React.useState('');
    const[currentServing, setCurrentServing] = React.useState('');
    const[nextTokenNumber, setNextTokenNumber] = React.useState(1);
    const[customersServed, setCustomersServed] = React.useState(0);
    const[averageServiceTime, setAverageServiceTime] = React.useState(0);


    const fetchQueueDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/queue/${id}`,
          {
            withCredentials: true,
          },
        );
        // console.log(response.data.queue);

        const queue = response.data.queue;
        setName(queue.name);
        setDescription(queue.description);
        setStatus(queue.status);
        setCurrentServing(queue.currentServing);
        setNextTokenNumber(queue.nextTokenNumber);
        setCustomersServed(queue.customersServed);
        setAverageServiceTime(queue.averageServiceTime);
      } catch (err) {
        console.error("Error fetching queue details:", err);
      }
    };

    useEffect(() => {
        
        fetchQueueDetails();
    }, []);

    useEffect(() => {
      socket.connect();
      
      socket.emit("joinQueue",id);
      socket.on("queueUpdated", () => {
        // console.log("Queue updated event received");
        fetchQueueDetails();
      });

      return() => {
        socket.off("queueUpdated");
        socket.disconnect();
      }
    },[id])

    const callNext = async () => {
      try{
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/queue/${id}/call-next`, {}, {
          withCredentials: true,
        });
        console.log("Call Next response:", response.data);
      }catch(err){
        console.log("Error calling next token:", err);
      }
    }

    const serve = async () => {
      try{
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/queue/${id}/serve`, {}, {
          withCredentials: true,
        });
        console.log("Serve response:", response.data);
      }catch(err){
        console.log("Error serving token:", err);
      }
    }
    const skip = async () => {
      try{
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/queue/${id}/skip`, {}, {
          withCredentials: true,
        });
        console.log("Skip response:", response.data);
      }catch(err){
        console.log("Error skipping token:", err);
      }
    }

    const pauseQueue = async () => {
      try{
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/queue/${id}/pause`,{},
          {
          withCredentials: true,
        });
        console.log("Pause Queue response:", response.data);
      }catch(err){
        console.log("Error pausing queue:", err);
      }
    }
    const resumeQueue = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/queue/${id}/resume`,{},
          {
            withCredentials: true,
          },
        );
        console.log("Resume Queue response:", response.data);
      } catch (err) {
        console.log("Error resuming queue:", err);
      }

    }
    const closeQueue = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/queue/${id}/close`,{},
          {
            withCredentials: true,
          },
        );
        console.log("Close Queue response:", response.data);
      } catch (err) {
          console.log("Error closing queue:", err);
      }
    }
    const openQueue = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/queue/${id}/open`,{},
          {
            withCredentials: true,
          },
        );
        console.log("Open Queue response:", response.data);
      } catch (err) {
        console.log("Error opening queue:", err);
      }
    }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 w-150 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Queue Details
        </h1>

        <div className="grid grid-cols-2 gap-y-5 gap-x-8">
          <div>
            <p className="text-sm font-medium text-gray-500">Queue Name</p>
            <p className="font-semibold">{name}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p>{status}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Current Serving</p>
            <p>{currentServing || "None"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Next Token</p>
            <p>{nextTokenNumber}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">
              Customers Served
            </p>
            <p>{customersServed}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">
              Average Service Time
            </p>
            <p>{averageServiceTime.toFixed(1)} mins</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
          <p>{description}</p>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Serving Controls
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg cursor-pointer transition-colors duration-200"
              onClick={callNext}
            >
              Call Next
            </button>

            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg cursor-pointer transition-colors duration-200"
              onClick={serve}
            >
              Serve
            </button>

            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg cursor-pointer transition-colors duration-200"
              onClick={skip}
            >
              Skip
            </button>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-3">
            Queue Controls
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg cursor-pointer transition-colors duration-200"
              onClick={pauseQueue}
            >
              Pause Queue
            </button>

            <button
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg cursor-pointer transition-colors duration-200"
              onClick={resumeQueue}
            >
              Resume Queue
            </button>

            <button
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg cursor-pointer transition-colors duration-200"
              onClick={closeQueue}
            >
              Close Queue
            </button>

            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg cursor-pointer transition-colors duration-200"
              onClick={openQueue}
            >
              Open Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueueDetails