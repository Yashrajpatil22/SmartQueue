import React,{useState, useEffect} from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import AlertBox from '../components/AlertBox'

function CustomerList() {
  const [queueEntries, setQueueEntries] = useState([]);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const {queueId} = useParams();
  useEffect(() => {
    const fetchWaitingQueueEntries = async () => {
        try{
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/queue/${queueId}/waiting-entries`,
              {
                withCredentials: true,
              }
            );
            setQueueEntries(response.data.queueEntries);
        }catch(error){
            setAlert({
                message: error.response?.data?.message || 'Failed to fetch waiting queue entries.',
                type: 'error',
              });
            console.log("Error fetching waiting queue entries:", error);
        }
    }
    fetchWaitingQueueEntries();
  },[]);

    const cancelEntry = async (entryId) => {
        try{
            const response = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/queue/${queueId}/entry/${entryId}/cancel`,
              {},
              {
                withCredentials: true,
              }
            );
            console.log("Cancel Entry response:", response.data);
            setAlert({
                message: response.data.message,
                type: 'success',
              });
            setQueueEntries(queueEntries.filter(entry => entry._id !== entryId));
        }catch(error){
          setAlert({
            message: error.response?.data?.message || 'Failed to cancel queue entry.',
            type: 'error',
          });
            console.log("Error cancelling queue entry:", error);
        }
    }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Waiting Customers
      </h1>

      <div className="w-full max-w-3xl space-y-4">
        {queueEntries.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow p-8 text-center">
            <p className="text-gray-500 text-lg">
              No customers are currently waiting.
            </p>
          </div>
        ) : (
          queueEntries.map((entry) => (
            <div
              key={entry._id}
              className="bg-white border border-gray-200 rounded-2xl shadow p-5 hover:border-blue-500 transition-colors duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Customer Name
                    </p>
                    <p className="font-semibold text-lg">
                      {entry.customerName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Phone Number
                    </p>
                    <p>{entry.phoneNumber}</p>
                  </div>

                  <div className="flex gap-8 mt-2">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Token</p>
                      <p className="font-semibold">#{entry.tokenNumber}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Status
                      </p>
                      <p className="text-yellow-600 font-semibold">
                        {entry.status}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => cancelEntry(entry._id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg cursor-pointer transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CustomerList