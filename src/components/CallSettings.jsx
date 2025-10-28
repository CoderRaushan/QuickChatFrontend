import React, { useState, useEffect } from "react";
import { FaMicrophone, FaVideo, FaVolumeUp, FaCog, FaTimes } from "react-icons/fa";

const CallSettings = ({ 
  isVisible, 
  onClose, 
  availableDevices, 
  selectedDevices, 
  onDeviceChange,
  onTestAudio,
  onTestVideo 
}) => {
  const [activeTab, setActiveTab] = useState('audio');
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [isTestingVideo, setIsTestingVideo] = useState(false);

  const tabs = [
    { id: 'audio', label: 'Audio', icon: FaMicrophone },
    { id: 'video', label: 'Video', icon: FaVideo },
    { id: 'speaker', label: 'Speaker', icon: FaVolumeUp }
  ];

  const handleDeviceChange = (type, deviceId) => {
    onDeviceChange(type, deviceId);
  };

  const handleTestAudio = async () => {
    setIsTestingAudio(true);
    try {
      await onTestAudio();
    } finally {
      setTimeout(() => setIsTestingAudio(false), 2000);
    }
  };

  const handleTestVideo = async () => {
    setIsTestingVideo(true);
    try {
      await onTestVideo();
    } finally {
      setTimeout(() => setIsTestingVideo(false), 2000);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaCog className="text-blue-500" size={20} />
            <h2 className="text-xl font-bold text-gray-800">Call Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Audio Settings */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Microphone
                </label>
                <select
                  value={selectedDevices.audio}
                  onChange={(e) => handleDeviceChange('audio', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {availableDevices.audio.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleTestAudio}
                  disabled={isTestingAudio}
                  className="mt-2 text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50"
                >
                  {isTestingAudio ? 'Testing...' : 'Test microphone'}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audio Level
                </label>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
          )}

          {/* Video Settings */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Camera
                </label>
                <select
                  value={selectedDevices.video}
                  onChange={(e) => handleDeviceChange('video', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {availableDevices.video.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleTestVideo}
                  disabled={isTestingVideo}
                  className="mt-2 text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50"
                >
                  {isTestingVideo ? 'Testing...' : 'Test camera'}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Quality
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="high">High Quality (720p)</option>
                  <option value="medium">Medium Quality (480p)</option>
                  <option value="low">Low Quality (360p)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Camera Preview
                </label>
                <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Camera preview will appear here</span>
                </div>
              </div>
            </div>
          )}

          {/* Speaker Settings */}
          {activeTab === 'speaker' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speaker
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="default">Default Speaker</option>
                  <option value="headphones">Headphones</option>
                  <option value="bluetooth">Bluetooth Device</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="80"
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500 w-12">80%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Echo Cancellation
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="echo-cancellation"
                    defaultChecked
                    className="mr-2"
                  />
                  <label htmlFor="echo-cancellation" className="text-sm text-gray-700">
                    Enable echo cancellation
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Noise Suppression
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="noise-suppression"
                    defaultChecked
                    className="mr-2"
                  />
                  <label htmlFor="noise-suppression" className="text-sm text-gray-700">
                    Enable noise suppression
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallSettings;
