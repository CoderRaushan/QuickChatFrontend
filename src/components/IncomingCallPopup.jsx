// components/IncomingCallPopup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const IncomingCallPopup = ({ caller, onAccept, onReject }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-5 right-5 bg-white shadow-lg rounded-lg p-4 z-[1000]">
      <p className="font-bold">{caller?.name} is calling you</p>
      <div className="flex justify-between mt-3">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={onAccept}
        >
          Accept
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={onReject}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default IncomingCallPopup;
