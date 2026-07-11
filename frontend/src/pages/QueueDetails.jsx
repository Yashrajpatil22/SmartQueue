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
    }, [id]);

    useEffect(() => {
      socket.connect();
      socket.emit("joinQueue",{id});

      return() => {
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

        <div className="grid grid-cols-3 gap-4 mt-10">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg cursor-pointer transition-colors duration-200"
          onClick={callNext}
          >
            Call Next
          </button>

          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg cursor-pointer transition-colors duration-200"
          onClick={serve}
          >
            Serve
          </button>

          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg cursor-pointer transition-colors duration-200"
          onClick={skip}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

export default QueueDetails