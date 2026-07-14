import React,{useState, useEffect} from 'react'
// import axios from 'axios'
import api from '../services/api'
import { useNavigate, useParams } from 'react-router-dom'

function EditQueue() {
    const {id} = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {

        e.preventDefault();
        // if(!name.trim()){
        //     console.error("Queue name is required");
        //     return;
        // }
        try {
          const response = await api.put(
            `/api/queue/${id}`,
            {
              name,
              description,
            },
            {
              withCredentials: true,
            },
          );
          console.log(response.data);
          navigate("/queue-list");
        } catch (err) {
          console.error("Error Editing queue:", err);
        }
    }

    useEffect(() => {
      const fetchQueue = async () => {
        try{
          const response = await api.get(`/api/queue/${id}`, {
            withCredentials: true,
          });
          const queueData = response.data.queue;
          setName(queueData.name);
          setDescription(queueData.description);
        }catch(error){
          console.log("Error fetching queue:", error);
        }
      }
      fetchQueue();
    },[]);
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen bg-gray-100">
      {/* <h1 className="text-3xl font-bold text-gray-900">SmartQueue</h1> */}
      <div className="p-8 border rounded-2xl w-96 shadow-lg bg-white border-gray-200">
        <h2 className="text-2xl font-bold mb-5 text-center text-gray-900">
          Edit Queue
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 font-medium">Queue Name</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter queue name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 font-medium">Description</label>
            {/* <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter queue description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            /> */}
            <textarea
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter queue description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full cursor-pointer"
            >
              Edit Queue
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}

export default EditQueue