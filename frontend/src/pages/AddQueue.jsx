import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AlertBox from '../components/AlertBox'

function AddQueue() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [alert, setAlert] = useState({
        message: '',
        type: '',
    });

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!name.trim()){
            setAlert({
              message: "Queue name is required.",
              type: "error",
            });
            return;
        }
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/queue`,
            {
              name,
              description,
            },
            {
              withCredentials: true,
            },
          );
          console.log(response.data);
          setAlert({
            message: response.data.message,
            type: 'success',
          });
          navigate("/queue-list");
        } catch (err) {
          // console.log("Entered catch");
          setAlert({
            message: err.response?.data?.message || 'Something went wrong.',
            type: 'error',
          });
          // console.log(alert)
          console.error("Error adding queue:", err);
        }
    }
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen bg-gray-100">
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

      <div className="p-8 border rounded-2xl w-96 shadow-lg bg-white border-gray-200">
        <h2 className="text-2xl font-bold mb-5 text-center text-gray-900">
          Add Queue
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
              Add Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddQueue