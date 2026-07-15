import React from 'react'

function AlertBox({ message, type }) {
  if (!message) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
          type === "success"
            ? "bg-green-600"
            : "bg-red-600"
        }`}
      >
        {type === "success" ? "✅ " : "❌ "}
        {message}
      </div>
    </div>
  );
}

export default AlertBox;

