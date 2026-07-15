import React,{useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
// import axios from 'axios'
import api from '../services/api'
import socket from '../services/socket'
import AlertBox from '../components/AlertBox'

function QueueDetails() {
    const {id} = useParams();
    const[name, setName] = useState('');
    const[description, setDescription] = useState('');
    const[status, setStatus] = useState('');
    const[currentServing, setCurrentServing] = useState('');
    const[nextTokenNumber, setNextTokenNumber] = useState(1);
    const[customersServed, setCustomersServed] = useState(0);
    const[averageServiceTime, setAverageServiceTime] = useState(0);
    const[totalEntries, setTotalEntries] = useState(0);
    const[waitingEntries, setWaitingEntries] = useState(0);
    const[servedEntries, setServedEntries] = useState(0);
    const[skippedEntries, setSkippedEntries] = useState(0);
    const[cancelledEntries, setCancelledEntries] = useState(0);
    const [alert, setAlert] = useState({
        message: '',
        type: '',
    });


    const fetchQueueDetails = async () => {
      try {
        const response = await api.get(
          `/api/queue/${id}`,
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
        setAlert({
          message: err.response?.data?.message || 'Failed to fetch queue details.',
          type: 'error',
        });
        console.error("Error fetching queue details:", err);
      }
    };
    const fetchQueueAnalytics = async () => {
      try{
        const response = await api.get(`/api/queue/${id}/analytics`, {
          withCredentials: true,
        });
        const analytics = response.data.analytics;
        setTotalEntries(analytics.totalEntries);
        setWaitingEntries(analytics.waitingEntries);
        setServedEntries(analytics.servedEntries);
        setSkippedEntries(analytics.skippedEntries);
        setCancelledEntries(analytics.cancelledEntries);
      }catch(err){
        setAlert({
          message: err.response?.data?.message || 'Failed to fetch queue analytics.',
          type: 'error',
        });
        console.error("Error fetching queue analytics:", err);
      }
    }

    useEffect(() => {
        
        fetchQueueDetails();
        fetchQueueAnalytics();
    }, []);

    useEffect(() => {
      socket.connect();
      
      socket.emit("joinQueue",id);
      socket.on("queueUpdated", () => {
        // console.log("Queue updated event received");
        fetchQueueDetails();
        fetchQueueAnalytics();
      });

      return() => {
        socket.off("queueUpdated");
        socket.disconnect();
      }
    },[id])

    const callNext = async () => {
      try{
        const response = await api.post(`/api/queue/${id}/call-next`, {}, {
          withCredentials: true,
        });
        console.log("Call Next response:", response.data);
        setAlert({
          message: response.data.message,
          type: 'success',
        });
      }catch(err){
        setAlert({
          message: err.response?.data?.message || 'Failed to call next token.',
          type: 'error',
        });
        console.log("Error calling next token:", err);
      }
    }

    const serve = async () => {
      try{
        const response = await api.post(`/api/queue/${id}/serve`, {}, {
          withCredentials: true,
        });
        console.log("Serve response:", response.data);
        setAlert({
          message: response.data.message,
          type: 'success',
        });
      }catch(err){
        setAlert({
          message: err.response?.data?.message || 'Failed to serve token.',
          type: 'error',
        });
        console.log("Error serving token:", err);
      }
    }
    const skip = async () => {
      try{
        const response = await api.post(`/api/queue/${id}/skip`, {}, {
          withCredentials: true,
        });
        console.log("Skip response:", response.data);
        setAlert({
          message: response.data.message,
          type: 'success',
        });
      }catch(err){
        setAlert({
          message: err.response?.data?.message || 'Failed to skip token.',
          type: 'error',
        });
        console.log("Error skipping token:", err);
      }
    }

    const pauseQueue = async () => {
      try{
        const response = await api.post(`/api/queue/${id}/pause`,{},
          {
          withCredentials: true,
        });
        console.log("Pause Queue response:", response.data);
        setAlert({
          message: response.data.message,
          type: 'success',
        });
      }catch(err){
        setAlert({
          message: err.response?.data?.message || 'Failed to pause queue.',
          type: 'error',
        });
        console.log("Error pausing queue:", err);
      }
    }
    const resumeQueue = async () => {
      try {
        const response = await api.post(
          `/api/queue/${id}/resume`,{},
          {
            withCredentials: true,
          },
        );
        console.log("Resume Queue response:", response.data);
        setAlert({
          message: response.data.message,
          type: 'success',
        });
      } catch (err) {
        setAlert({
          message: err.response?.data?.message || 'Failed to resume queue.',
          type: 'error',
        });
        console.log("Error resuming queue:", err);
      }

    }
    const closeQueue = async () => {
      try {
        const response = await api.post(
          `/api/queue/${id}/close`,{},
          {
            withCredentials: true,
          },
        );
        console.log("Close Queue response:", response.data);
        setAlert({
          message: response.data.message,
          type: 'success',
        });
      } catch (err) {
        setAlert({
          message: err.response?.data?.message || 'Failed to close queue.',
          type: 'error',
        });
          console.log("Error closing queue:", err);
      }
    }
    const openQueue = async () => {
      try {
        const response = await api.post(
          `/api/queue/${id}/open`,{},
          {
            withCredentials: true,
          },
        );
        console.log("Open Queue response:", response.data);
        setAlert({
          message: response.data.message,
          type: 'success',
        });
      } catch (err) {
        setAlert({
          message: err.response?.data?.message || 'Failed to open queue.',
          type: 'error',
        });
        console.log("Error opening queue:", err);
      }
    }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
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

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Today's Analytics
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500">Total Entries</p>
              <p className="text-2xl font-bold text-blue-600">{totalEntries}</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500">Waiting</p>
              <p className="text-2xl font-bold text-yellow-500">
                {waitingEntries}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500">Served</p>
              <p className="text-2xl font-bold text-green-600">
                {servedEntries}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500">Skipped</p>
              <p className="text-2xl font-bold text-orange-500">
                {skippedEntries}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">
                {cancelledEntries}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueueDetails