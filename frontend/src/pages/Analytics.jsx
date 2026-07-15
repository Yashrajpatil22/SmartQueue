import React,{useState, useEffect} from 'react'
import axios from 'axios'
import AlertBox from '../components/AlertBox';
// import {useNavigate} from 'react-router-dom'

function Analytics() {
    const [totalEntries, setTotalEntries] = useState(0);
    const [totalWaitingEntries, setTotalWaitingEntries] = useState(0);
    const [totalServedEntries, setTotalServedEntries] = useState(0);
    const [totalCancelledEntries, setTotalCancelledEntries] = useState(0);
    const [totalSkippedEntries, setTotalSkippedEntries] = useState(0);
    const [totalQueues, setTotalQueues] = useState(0);
    const [activeQueues, setActiveQueues] = useState(0);
    const [closedQueues, setClosedQueues] = useState(0);
    const [pausedQueues, setPausedQueues] = useState(0);
    const [alert, setAlert] = useState({
        message: '',
        type: '',
    });

    // const navigate = useNavigate();

    useEffect(() => {
        const fetchAnalytics = async () => {
            {
                try{
                    const response = await axios.get(
                      `${import.meta.env.VITE_API_URL}/api/analytics`,
                      {
                        withCredentials: true,
                      },
                    );
                    // console.log(response.data.data);
                    setTotalEntries(response.data.data.totalEntries);
                    setTotalWaitingEntries(response.data.data.totalWaitingEntries);
                    setTotalServedEntries(response.data.data.totalServedEntries);
                    setTotalCancelledEntries(response.data.data.totalCancelledEntries);
                    setTotalSkippedEntries(response.data.data.totalSkippedEntries);
                    setTotalQueues(response.data.data.totalQueues);
                    setActiveQueues(response.data.data.activeQueues);
                    setClosedQueues(response.data.data.closedQueues);
                    setPausedQueues(response.data.data.pausedQueues);
                }catch(error){
                  setAlert({
                    message: error.response?.data?.message || "Failed to fetch analytics.",
                    type: "error",
                  });
                    console.log("Error fetching analytics:", error);
                }
            }
        }
        fetchAnalytics();

    })
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
      <div className="bg-white w-full max-w-5xl p-8 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Today's Analytics
        </h1>

        <p className="text-center text-gray-500 mb-8">Tenant Overview</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
            <p className="text-sm text-gray-500">Total Entries</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {totalEntries}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
            <p className="text-sm text-gray-500">Waiting</p>
            <p className="text-3xl font-bold text-yellow-500 mt-2">
              {totalWaitingEntries}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
            <p className="text-sm text-gray-500">Served</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {totalServedEntries}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
            <p className="text-sm text-gray-500">Cancelled</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {totalCancelledEntries}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
            <p className="text-sm text-gray-500">Skipped</p>
            <p className="text-3xl font-bold text-orange-500 mt-2">
              {totalSkippedEntries}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
            <p className="text-sm text-gray-500">Total Queues</p>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {totalQueues}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">
          Queue Status
        </h2>

        <div className="grid grid-cols-3 gap-5">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {activeQueues}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
            <p className="text-sm text-gray-500">Paused</p>
            <p className="text-3xl font-bold text-yellow-500 mt-2">
              {pausedQueues}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
            <p className="text-sm text-gray-500">Closed</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {closedQueues}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics