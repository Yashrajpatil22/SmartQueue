import React from 'react'

function AddQueue() {
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen bg-gray-100">
      {/* <h1 className="text-3xl font-bold text-gray-900">SmartQueue</h1> */}
      <div className="p-8 border rounded-2xl w-96 shadow-lg bg-white border-gray-200">
        <h2 className="text-2xl font-bold mb-5 text-center text-gray-900">
          Add Queue
        </h2>
        <form>
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