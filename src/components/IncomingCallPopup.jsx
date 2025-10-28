// components/IncomingCallPopup.jsx
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FaPhone, FaPhoneSlash, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";

const IncomingCallPopup = ({ caller, onAccept, onReject, onToggleAudio, onToggleVideo, isAudioEnabled = true, isVideoEnabled = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAccept = () => {
    setIsVisible(false);
    setTimeout(() => onAccept(), 300);
  };

  const handleReject = () => {
    setIsVisible(false);
    setTimeout(() => onReject(), 300);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className={`bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center transform transition-all duration-300 ${
        isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        {/* Caller Info */}
        <div className="relative mb-6">
          <div className="relative">
            <Avatar className="h-32 w-32 mx-auto border-4 border-green-500">
              <AvatarImage
                src={caller?.profilePicture}
                className="object-cover w-full h-full rounded-full"
              />
              <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {caller?.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            {/* Animated ring */}
            <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping opacity-75"></div>
            <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-pulse"></div>
          </div>
        </div>

        {/* Caller Details */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{caller?.name}</h2>
          <p className="text-gray-600 text-lg">Incoming video call...</p>
          {callDuration > 0 && (
            <p className="text-sm text-gray-500 mt-2">{formatDuration(callDuration)}</p>
          )}
        </div>

        {/* Call Controls */}
        <div className="space-y-4">
          {/* Main Action Buttons */}
          <div className="flex gap-6 justify-center">
            <button
              onClick={handleAccept}
              className="bg-green-500 text-white p-6 rounded-full hover:bg-green-600 transition-all duration-200 hover:scale-110 shadow-lg"
            >
              <FaPhone size={28} />
            </button>
            <button
              onClick={handleReject}
              className="bg-red-500 text-white p-6 rounded-full hover:bg-red-600 transition-all duration-200 hover:scale-110 shadow-lg"
            >
              <FaPhoneSlash size={28} />
            </button>
          </div>

          {/* Secondary Controls */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={onToggleAudio}
              className={`p-4 rounded-full transition-all duration-200 hover:scale-110 ${
                isAudioEnabled 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
            >
              {isAudioEnabled ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
            </button>
            <button
              onClick={onToggleVideo}
              className={`p-4 rounded-full transition-all duration-200 hover:scale-110 ${
                isVideoEnabled 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
            >
              {isVideoEnabled ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
            </button>
          </div>
        </div>

        {/* Call Type Indicator */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Video Call</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallPopup;
