import React, {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function JoinQueue() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [queueName, setQueueName] = useState('');
    const [businessName, setBusinessName] = useState('');

    useEffect(() => {

            const fetchQueueDetails = async () => {
              try{
                const response = await axios.get(
                  `${import.meta.env.VITE_API_URL}/api/queue/${id}`,
                  {
                    withCredentials: true,
                  },
                );
                setQueueName(response.data.queue.name);
                setBusinessName(response.data.tenant.name);
                // setQueueName(response.data.name);
                // setBusinessName(response.data.businessName);
              }catch(error){
                console.error("Error fetching queue details:", error);
              }
            };
            fetchQueueDetails();
            
        
    },[]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/queue/${id}/join`,
              { customerName:name, phoneNumber: phone },
              {
                withCredentials: true,
              },
            );
            console.log("Successfully joined the queue:", response.data);
            navigate(`/queue/${id}`);
        }catch(error){
            console.error("Error joining queue:", error);
        }
    }


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          SmartQueue
        </h1>

        <p className="text-center text-gray-500 mb-8">Join Queue</p>

        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900">{queueName}</h2>

          <p className="text-gray-600">{businessName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Phone Number
            </label>

            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            Join Queue
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinQueue