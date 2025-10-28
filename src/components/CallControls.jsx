import React from "react";
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
  FaVolumeUp,
  FaVolumeMute,
  FaDesktop,
  FaMobile
} from "react-icons/fa";

const CallControls = ({
  onEndCall,
  onToggleAudio,
  onToggleVideo,
  onToggleFullscreen,
  onToggleSettings,
  onToggleSpeaker,
  onSwitchCamera,
  isAudioEnabled = true,
  isVideoEnabled = true,
  isFullscreen = false,
  isSpeakerEnabled = false,
  showSettings = false,
  showSpeakerToggle = true,
  showCameraSwitch = true,
  showFullscreenToggle = true,
  showSettingsToggle = true,
  className = ""
}) => {
  return (
    <div className={`bg-black bg-opacity-50 p-6 ${className}`}>
      <div className="flex justify-center items-center gap-4">
        {/* Audio Toggle */}
        <button
          onClick={onToggleAudio}
          className={`p-4 rounded-full transition-all duration-200 hover:scale-110 ${
            isAudioEnabled 
              ? 'bg-gray-600 text-white hover:bg-gray-700' 
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
          title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
        >
          {isAudioEnabled ? <FaMicrophone size={24} /> : <FaMicrophoneSlash size={24} />}
        </button>

        {/* Video Toggle */}
        <button
          onClick={onToggleVideo}
          className={`p-4 rounded-full transition-all duration-200 hover:scale-110 ${
            isVideoEnabled 
              ? 'bg-gray-600 text-white hover:bg-gray-700' 
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
          title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
        >
          {isVideoEnabled ? <FaVideo size={24} /> : <FaVideoSlash size={24} />}
        </button>

        {/* End Call */}
        <button
          onClick={onEndCall}
          className="bg-red-500 text-white p-4 rounded-full hover:bg-red-600 transition-all duration-200 hover:scale-110"
          title="End call"
        >
          <FaPhoneSlash size={24} />
        </button>

        {/* Speaker Toggle */}
        {showSpeakerToggle && (
          <button
            onClick={onToggleSpeaker}
            className={`p-4 rounded-full transition-all duration-200 hover:scale-110 ${
              isSpeakerEnabled 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
            title={isSpeakerEnabled ? "Disable speaker" : "Enable speaker"}
          >
            {isSpeakerEnabled ? <FaVolumeUp size={24} /> : <FaVolumeMute size={24} />}
          </button>
        )}

        {/* Camera Switch */}
        {showCameraSwitch && (
          <button
            onClick={onSwitchCamera}
            className="bg-gray-600 text-white p-4 rounded-full hover:bg-gray-700 transition-all duration-200 hover:scale-110"
            title="Switch camera"
          >
            <FaMobile size={24} />
          </button>
        )}

        {/* Fullscreen Toggle */}
        {showFullscreenToggle && (
          <button
            onClick={onToggleFullscreen}
            className="bg-gray-600 text-white p-4 rounded-full hover:bg-gray-700 transition-all duration-200 hover:scale-110"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <FaCompress size={24} /> : <FaExpand size={24} />}
          </button>
        )}

        {/* Settings Toggle */}
        {showSettingsToggle && (
          <button
            onClick={onToggleSettings}
            className={`p-4 rounded-full transition-all duration-200 hover:scale-110 ${
              showSettings 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
            title="Call settings"
          >
            <FaCog size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CallControls;
