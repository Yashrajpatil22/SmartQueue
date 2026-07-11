import React, {useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function QueueList() {
    const [queues, setQueues] = React.useState([]);
    const navigate = useNavigate();
    useEffect(() =>{
        const fetchQueues = async () => {
            try{
                const response = await axios.get(
                  `${import.meta.env.VITE_API_URL}/api/queue`,
                  {
                    withCredentials: true,
                  }
                );
                setQueues(response.data.queues);
            }catch(error){
                console.log("Error fetching queues:", error)
            }
        }
        fetchQueues();
    }, [])
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className='text-3xl font-bold mb-4'>Queues</h1>
        {queues.map((queue) => (
          <div key={queue._id} className="bg-white p-4 shadow mb-4 w-1/2 border border-gray-300 rounded-2xl hover:border-blue-500 cursor-pointer"
          onClick={() => navigate(`/queue/${queue._id}`)}>
            <h2 className="text-xl font-semibold">{queue.name}</h2>
            <h2 className="text-lg text-gray-600">{queue.status}</h2>
          </div>
        ))}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        onClick={() => navigate("/add-queue")}>
          Add Queue
        </button>
    </div>
  )
}

export default QueueList