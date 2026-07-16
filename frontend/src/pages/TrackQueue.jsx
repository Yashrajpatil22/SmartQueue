import React, {useState} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
// import api from '../services/api'
import { useEffect } from 'react';
import socket from '../services/socket'
import AlertBox from '../components/AlertBox'

function TrackQueue() {
    const {id} = useParams();
    const [queueName, setQueueName] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [tokenNumber, setTokenNumber] = useState();
    const [position, setPosition] = useState();
    const [status, setStatus] = useState('');
    const [estimatedWait, setEstimatedWait] = useState();
    const [queueId, setQueueId] = useState('');
    const [alert, setAlert] = useState({
        message: '',
        type: '',
    });


    const fetchQueueStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/customer/entry/${id}`);
        // console.log(response.data);
        setQueueName(response.data.entry.queueName);
        setBusinessName(response.data.entry.businessName);
        setTokenNumber(response.data.entry.tokenNumber);
        setPosition(response.data.entry.customerAheadCount + 1);
        setStatus(response.data.entry.status);
        setEstimatedWait(response.data.entry.waitingTimeEstimate);
        setQueueId(response.data.entry.queueId);
      } catch (error) {
        setAlert({
          message: error.response?.data?.message || 'Failed to fetch queue status.',
          type: 'error',
        });
        console.error("Error fetching queue status:", error);
      }
    };

    useEffect(() => {
        
        fetchQueueStatus();
    },[]);

    useEffect(() => {
        if(!queueId) return;
      socket.connect();
        console.log(queueId);
      socket.emit("joinQueue", queueId);
      socket.on("queueUpdated", () => {
        // console.log("Queue updated event received");
        fetchQueueStatus();
      });

      return () => {
        socket.off("queueUpdated");
        socket.disconnect();
      };
    }, [queueId]);

    const handleCancelEntry = async () => {
      if (!window.confirm("Are you sure you want to cancel this entry?")) {
        return;
      }
      try{
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/queue/${queueId}/entry/${id}/cancel`);
        console.log(response.data);
        setAlert({
          message: response.data.message,
          type: 'success',
        });
        setStatus('Cancelled');
      }catch(error){
        setAlert({
          message: error.response?.data?.message || 'Failed to cancel entry.',
          type: 'error',
        });
        console.error("Error cancelling entry:", error);
      }
    }

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
      <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          SmartQueue
        </h1>

        <p className="text-center text-gray-500 mb-8">Live Queue Status</p>

        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">{queueName}</h2>

          <p className="text-gray-600">{businessName}</p>
        </div>

        <div className="grid grid-cols-2 gap-y-6">
          <div>
            <p className="text-sm text-gray-500 font-medium">Token Number</p>

            <p className="text-2xl font-bold text-blue-600">{tokenNumber}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 font-medium">Position</p>

            <p className="text-2xl font-bold">{position}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 font-medium">Status</p>

            <p className="font-semibold">{status}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 font-medium">Estimated Wait</p>

            <p className="font-semibold">{estimatedWait} mins</p>
          </div>
        </div>
        <div className="mt-8">
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full cursor-pointer"
          onClick={() => {handleCancelEntry()}}>
            Cancel Entry
          </button>
        </div>

      </div>
    </div>
  );
}

export default TrackQueue