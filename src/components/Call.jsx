
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { 
  FaPhone, 
  FaPhoneSlash, 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaVideo, 
  FaVideoSlash,
  FaExpand,
  FaCompress,
  FaCog,
  FaUserFriends,
  FaDesktop,
  FaShare
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useVideoCall } from "../Hooks/useVideoCall.js";
import CallControls from "./CallControls.jsx";
import CallSettings from "./CallSettings.jsx";
import CallNotification from "./CallNotification.jsx";

function Call() {
  const { user, selectedUsers } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const { id: callUserId } = useParams();
  
  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  
  const fullscreenRef = useRef(null);

  // Use the video call hook
  const {
    callState,
    localStream,
    remoteStream,
    isAudioEnabled,
    isVideoEnabled,
    isSpeakerEnabled,
    callDuration,
    connectionQuality,
    callerInfo,
    availableDevices,
    selectedDevices,
    isScreenSharing,
    isRecording,
    localVideoRef,
    remoteVideoRef,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleAudio,
    toggleVideo,
    toggleSpeaker,
    switchCamera,
    startScreenShare,
    stopScreenShare,
    formatDuration
  } = useVideoCall(user, selectedUsers);

  // Handle incoming call state
  useEffect(() => {
    if (callState === 'incoming') {
      setIsIncomingCall(true);
    } else {
      setIsIncomingCall(false);
    }
  }, [callState]);

  // Update local video when stream changes
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, localVideoRef]);

  // Update remote video when stream changes
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, remoteVideoRef]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (fullscreenRef.current?.requestFullscreen) {
        fullscreenRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Handle device change
  const handleDeviceChange = (type, deviceId) => {
    // This would be implemented to change devices during call
    console.log(`Device changed: ${type} -> ${deviceId}`);
  };

  // Handle test audio/video
  const handleTestAudio = async () => {
    // Implement audio test functionality
    console.log("Testing audio...");
  };

  const handleTestVideo = async () => {
    // Implement video test functionality
    console.log("Testing video...");
  };

  // Handle incoming call actions
  const handleAcceptIncomingCall = () => {
    acceptCall();
  };

  const handleRejectIncomingCall = () => {
    rejectCall();
  };

  const handleCloseIncomingCall = () => {
    setIsIncomingCall(false);
  };

  // Handle call end and navigation
  const handleCallEnd = () => {
    endCall();
    setTimeout(() => {
      navigate('/conversation');
    }, 1000);
  };

  // Incoming call notification
  if (isIncomingCall && callerInfo) {
    return (
      <CallNotification
        caller={callerInfo}
        onAccept={handleAcceptIncomingCall}
        onReject={handleRejectIncomingCall}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        onClose={handleCloseIncomingCall}
      />
    );
  }

  return (
    <div className="flex flex-col items-center mt-20 ml-[250px] gap-4">
      {/* Call Setup Screen */}
      {callState === 'idle' && (
        <div className="flex flex-col items-center h-[500px] bg-gradient-to-br from-blue-500 to-purple-600 w-[400px] text-white pt-10 rounded-2xl gap-6 shadow-2xl">
          <Avatar className="h-32 w-32 border-4 border-white">
            <AvatarImage
              src={selectedUsers?.profilePicture}
              className="object-cover w-full h-full rounded-full"
            />
            <AvatarFallback className="text-3xl">U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-center">
            <h2 className="text-3xl font-bold">{selectedUsers?.name}</h2>
            <span className="text-lg opacity-90">Ready for video call?</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={startCall}
              className="bg-green-500 text-white p-4 rounded-full hover:bg-green-600 transition hover:scale-110"
            >
              <FaPhone size={28} />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-gray-600 text-white p-4 rounded-full hover:bg-gray-700 transition"
            >
              <FaCog size={24} />
            </button>
          </div>
          
          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-white text-gray-800 p-4 rounded-lg w-full max-w-sm">
              <h3 className="font-bold mb-3">Call Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Microphone</label>
                  <select 
                    value={selectedDevices.audio}
                    onChange={(e) => handleDeviceChange('audio', e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                  >
                    {availableDevices.audio.map(device => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Camera</label>
                  <select 
                    value={selectedDevices.video}
                    onChange={(e) => handleDeviceChange('video', e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                  >
                    {availableDevices.video.map(device => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Calling Screen */}
      {callState === 'calling' && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="text-center text-white">
            <Avatar className="h-32 w-32 mx-auto mb-6">
              <AvatarImage
                src={selectedUsers?.profilePicture}
                className="object-cover w-full h-full rounded-full"
              />
              <AvatarFallback className="text-3xl">U</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold mb-2">Calling {selectedUsers?.name}...</h2>
            <div className="animate-pulse">
              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
            <button
              onClick={() => {
                endCall();
                navigate('/conversation');
              }}
              className="mt-8 bg-red-500 text-white p-4 rounded-full hover:bg-red-600 transition"
            >
              <FaPhoneSlash size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Active Call Screen */}
      {callState === 'connected' && (
        <div ref={fullscreenRef} className="fixed inset-0 bg-black flex flex-col z-50">
          {/* Main Video Area */}
          <div className="flex-1 relative">
            {/* Remote Video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {!isVideoEnabled && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <FaVideoSlash size={32} className="text-white" />
                </div>
              )}
            </div>

            {/* Call Info Overlay */}
            <div className="absolute top-4 left-4 text-white">
              <div className="bg-black bg-opacity-50 rounded-lg p-3">
                <h3 className="font-bold">{selectedUsers?.name || callerInfo?.name}</h3>
                <p className="text-sm opacity-75">{formatDuration(callDuration)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${
                    connectionQuality === 'excellent' ? 'bg-green-500' :
                    connectionQuality === 'good' ? 'bg-yellow-500' :
                    connectionQuality === 'poor' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-xs capitalize">{connectionQuality}</span>
                </div>
                {isScreenSharing && (
                  <div className="flex items-center gap-1 mt-1">
                    <FaShare size={12} className="text-blue-400" />
                    <span className="text-xs text-blue-400">Screen sharing</span>
                  </div>
                )}
                {isRecording && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-red-400">Recording</span>
                  </div>
                )}
              </div>
            </div>

            {/* Screen Share Button */}
            {!isScreenSharing && (
              <button
                onClick={startScreenShare}
                className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition"
                title="Share screen"
              >
                <FaDesktop size={20} />
              </button>
            )}

            {/* Stop Screen Share Button */}
            {isScreenSharing && (
              <button
                onClick={stopScreenShare}
                className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition"
                title="Stop sharing"
              >
                <FaShare size={20} />
              </button>
            )}
          </div>

          {/* Call Controls */}
          <CallControls
            onEndCall={handleCallEnd}
            onToggleAudio={toggleAudio}
            onToggleVideo={toggleVideo}
            onToggleFullscreen={toggleFullscreen}
            onToggleSettings={() => setShowSettings(!showSettings)}
            onToggleSpeaker={toggleSpeaker}
            onSwitchCamera={switchCamera}
            isAudioEnabled={isAudioEnabled}
            isVideoEnabled={isVideoEnabled}
            isFullscreen={isFullscreen}
            isSpeakerEnabled={isSpeakerEnabled}
            showSettings={showSettings}
            showSpeakerToggle={true}
            showCameraSwitch={availableDevices.video.length > 1}
            showFullscreenToggle={true}
            showSettingsToggle={true}
          />
        </div>
      )}

      {/* Call Ended Screen */}
      {callState === 'ended' && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="text-center text-white">
            <div className="bg-red-500 rounded-full p-6 mx-auto mb-6 w-20 h-20 flex items-center justify-center">
              <FaPhoneSlash size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Call Ended</h2>
            <p className="text-lg opacity-75">Duration: {formatDuration(callDuration)}</p>
            <button
              onClick={() => navigate('/conversation')}
              className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Back to Conversations
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <CallSettings
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
        availableDevices={availableDevices}
        selectedDevices={selectedDevices}
        onDeviceChange={handleDeviceChange}
        onTestAudio={handleTestAudio}
        onTestVideo={handleTestVideo}
      />
    </div>
  );
}

export default Call;

