import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FaPhone, FaPhoneSlash, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";

const CallNotification = ({ 
  caller, 
  onAccept, 
  onReject, 
  onToggleAudio, 
  onToggleVideo, 
  isAudioEnabled = true, 
  isVideoEnabled = true,
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

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

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Full Screen Call Interface */}
      {!isMinimized && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center transform transition-all duration-300">
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

            {/* Minimize Button */}
            <button
              onClick={handleMinimize}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Minimized Call Notification */}
      {isMinimized && (
        <div className="fixed top-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-w-sm">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-green-500">
                  <AvatarImage
                    src={caller?.profilePicture}
                    className="object-cover w-full h-full rounded-full"
                  />
                  <AvatarFallback className="text-sm bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {caller?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">{caller?.name}</h3>
                <p className="text-sm text-gray-500">Incoming call...</p>
                {callDuration > 0 && (
                  <p className="text-xs text-gray-400">{formatDuration(callDuration)}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAccept}
                className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              >
                Accept
              </button>
              <button
                onClick={handleReject}
                className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Decline
              </button>
            </div>

            <div className="flex justify-between items-center mt-2">
              <button
                onClick={handleMinimize}
                className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
              >
                Expand
              </button>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CallNotification;
