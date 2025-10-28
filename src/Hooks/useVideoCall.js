import { useState, useRef, useEffect, useCallback } from 'react';
import { useSocket } from '../SocketContext.js';

export const useVideoCall = (user, selectedUser) => {
  const socket = useSocket();
  
  // Call state
  const [callState, setCallState] = useState('idle'); // idle, calling, connected, ended, incoming
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStartTime, setCallStartTime] = useState(null);
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [callerInfo, setCallerInfo] = useState(null);
  const [availableDevices, setAvailableDevices] = useState({ audio: [], video: [] });
  const [selectedDevices, setSelectedDevices] = useState({ audio: '', video: '' });
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Refs
  const peerConnectionRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const screenStreamRef = useRef(null);

  // Get available devices
  const getAvailableDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      setAvailableDevices({ audio: audioDevices, video: videoDevices });
      
      if (audioDevices.length > 0) {
        setSelectedDevices(prev => ({ ...prev, audio: audioDevices[0].deviceId }));
      }
      if (videoDevices.length > 0) {
        setSelectedDevices(prev => ({ ...prev, video: videoDevices[0].deviceId }));
      }
    } catch (err) {
      console.error("Error getting devices:", err);
    }
  }, []);

  // Get local media stream
  const getLocalStream = useCallback(async (constraints = { video: true, audio: true }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error("Error getting media stream:", err);
      throw err;
    }
  }, []);

  // Create peer connection
  const createPeerConnection = useCallback(() => {
    const config = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" }
      ],
    };
    
    const pc = new RTCPeerConnection(config);

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        const targetId = selectedUser?._id;
        socket.emit("icecandidate", {
          from: user._id,
          to: targetId,
          candidate: event.candidate,
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", pc.iceConnectionState);
      if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
        setConnectionQuality('excellent');
      } else if (pc.iceConnectionState === 'checking') {
        setConnectionQuality('connecting');
      } else if (pc.iceConnectionState === 'failed') {
        setConnectionQuality('poor');
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("Connection State:", pc.connectionState);
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        endCall();
      }
    };

    return pc;
  }, [socket, user, selectedUser]);

  // Initialize
  useEffect(() => {
    getLocalStream();
    getAvailableDevices();
  }, [getLocalStream, getAvailableDevices]);

  // Call duration timer
  useEffect(() => {
    let interval;
    if (callState === 'connected' && callStartTime) {
      interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState, callStartTime]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handleOffer = async ({ from, to, offer }) => {
      try {
        let peer = peerConnectionRef.current;
        
        if (!peer || peer.signalingState !== "stable") {
          if (peer) peer.close();
          peer = createPeerConnection();
          peerConnectionRef.current = peer;
        }

        if (localStream) {
          localStream.getTracks().forEach((track) => {
            try {
              peer.addTrack(track, localStream);
            } catch (e) {}
          });
        }

        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        socket.emit("answer", { 
          from: user._id, 
          to: from, 
          answer: peer.localDescription 
        });

        setCallState('connected');
        setCallStartTime(Date.now());
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    };

    const handleAnswer = async ({ from, to, answer }) => {
      try {
        const peer = peerConnectionRef.current;
        if (peer && peer.signalingState !== "stable") {
          await peer.setRemoteDescription(new RTCSessionDescription(answer));
          setCallState('connected');
          setCallStartTime(Date.now());
        }
      } catch (err) {
        console.error("Failed to handle answer:", err);
      }
    };

    const handleICE = async ({ from, candidate }) => {
      try {
        const peer = peerConnectionRef.current;
        if (peer) {
          await peer.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error("Error adding ICE candidate", err);
      }
    };

    const handleIncomingCall = ({ from, userInfo, callType }) => {
      setCallerInfo(userInfo);
      setCallState('incoming');
    };

    const handleCallAccepted = ({ from }) => {
      setCallState('connected');
      setCallStartTime(Date.now());
    };

    const handleCallRejected = ({ from, reason }) => {
      setCallState('ended');
      alert(`Call was rejected: ${reason || 'No reason provided'}`);
    };

    const handleHangup = ({ from, reason }) => {
      endCall();
    };

    const handleUserOffline = ({ to }) => {
      alert("User is offline");
      setCallState('ended');
    };

    const handleUserBusy = ({ to, reason }) => {
      alert(`User is busy: ${reason}`);
      setCallState('idle');
    };

    const handleUserDisconnected = ({ userId, reason }) => {
      alert(`User disconnected: ${reason}`);
      endCall();
    };

    const handleAudioToggle = ({ from, isMuted }) => {
      // Handle remote user's audio toggle
      console.log(`Remote user ${from} ${isMuted ? 'muted' : 'unmuted'} audio`);
    };

    const handleVideoToggle = ({ from, isVideoOff }) => {
      // Handle remote user's video toggle
      console.log(`Remote user ${from} ${isVideoOff ? 'turned off' : 'turned on'} video`);
    };

    const handleScreenShareStart = ({ from }) => {
      setIsScreenSharing(true);
    };

    const handleScreenShareStop = ({ from }) => {
      setIsScreenSharing(false);
    };

    const handleRecordingStart = ({ from }) => {
      setIsRecording(true);
    };

    const handleRecordingStop = ({ from }) => {
      setIsRecording(false);
    };

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("icecandidate", handleICE);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("call-rejected", handleCallRejected);
    socket.on("hangup", handleHangup);
    socket.on("user-offline", handleUserOffline);
    socket.on("user-busy", handleUserBusy);
    socket.on("user-disconnected", handleUserDisconnected);
    socket.on("audio-toggle", handleAudioToggle);
    socket.on("video-toggle", handleVideoToggle);
    socket.on("screen-share-start", handleScreenShareStart);
    socket.on("screen-share-stop", handleScreenShareStop);
    socket.on("recording-start", handleRecordingStart);
    socket.on("recording-stop", handleRecordingStop);

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("icecandidate", handleICE);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("call-rejected", handleCallRejected);
      socket.off("hangup", handleHangup);
      socket.off("user-offline", handleUserOffline);
      socket.off("user-busy", handleUserBusy);
      socket.off("user-disconnected", handleUserDisconnected);
      socket.off("audio-toggle", handleAudioToggle);
      socket.off("video-toggle", handleVideoToggle);
      socket.off("screen-share-start", handleScreenShareStart);
      socket.off("screen-share-stop", handleScreenShareStop);
      socket.off("recording-start", handleRecordingStart);
      socket.off("recording-stop", handleRecordingStop);
    };
  }, [socket, localStream, user, createPeerConnection]);

  // Start outgoing call
  const startCall = useCallback(async () => {
    if (!selectedUser?._id) {
      alert("Select a user to call");
      return;
    }

    try {
      setCallState('calling');
      const peer = createPeerConnection();
      peerConnectionRef.current = peer;

      if (localStream) {
        localStream.getTracks().forEach((track) => {
          try {
            peer.addTrack(track, localStream);
          } catch (e) {}
        });
      }

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socket.emit("call-user", {
        from: user._id,
        to: selectedUser._id,
        userInfo: {
          name: user.name,
          profilePicture: user.profilePicture,
        },
        callType: 'video'
      });

      socket.emit("offer", {
        from: user._id,
        to: selectedUser._id,
        offer: peer.localDescription,
      });

    } catch (err) {
      console.error("Error starting call:", err);
      setCallState('idle');
    }
  }, [selectedUser, localStream, user, socket, createPeerConnection]);

  // Accept incoming call
  const acceptCall = useCallback(async () => {
    try {
      setCallState('connected');
      setCallStartTime(Date.now());
      
      socket.emit("call-accepted", {
        from: user._id,
        to: callerInfo?.id,
      });
    } catch (err) {
      console.error("Error accepting call:", err);
    }
  }, [socket, user, callerInfo]);

  // Reject incoming call
  const rejectCall = useCallback(() => {
    socket.emit("call-rejected", {
      from: user._id,
      to: callerInfo?.id,
      reason: "User rejected the call"
    });
    setCallState('idle');
    setCallerInfo(null);
  }, [socket, user, callerInfo]);

  // End call
  const endCall = useCallback(() => {
    const targetId = selectedUser?._id || callerInfo?.id;
    if (targetId) {
      socket.emit("hangup", { 
        from: user._id, 
        to: targetId,
        reason: "Call ended by user"
      });
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    
    setCallState('ended');
    setCallDuration(0);
    setCallStartTime(null);
    setRemoteStream(null);
    setLocalStream(null);
    setCallerInfo(null);
    setIsScreenSharing(false);
    setIsRecording(false);
  }, [socket, user, selectedUser, callerInfo, localStream]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        
        // Notify remote user
        const targetId = selectedUser?._id || callerInfo?.id;
        if (targetId) {
          socket.emit("audio-toggle", {
            from: user._id,
            to: targetId,
            isMuted: !audioTrack.enabled
          });
        }
      }
    }
  }, [localStream, selectedUser, callerInfo, socket, user]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        
        // Notify remote user
        const targetId = selectedUser?._id || callerInfo?.id;
        if (targetId) {
          socket.emit("video-toggle", {
            from: user._id,
            to: targetId,
            isVideoOff: !videoTrack.enabled
          });
        }
      }
    }
  }, [localStream, selectedUser, callerInfo, socket, user]);

  // Toggle speaker
  const toggleSpeaker = useCallback(() => {
    setIsSpeakerEnabled(!isSpeakerEnabled);
  }, [isSpeakerEnabled]);

  // Switch camera
  const switchCamera = useCallback(async () => {
    try {
      const videoDevices = availableDevices.video;
      if (videoDevices.length < 2) {
        alert("No additional cameras available");
        return;
      }

      const currentDevice = selectedDevices.video;
      const nextDevice = videoDevices.find(device => device.deviceId !== currentDevice);
      
      if (nextDevice) {
        setSelectedDevices(prev => ({ ...prev, video: nextDevice.deviceId }));
        
        // Get new stream with different camera
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: nextDevice.deviceId } },
          audio: true
        });
        
        // Replace video track in peer connection
        if (peerConnectionRef.current && localStream) {
          const videoTrack = newStream.getVideoTracks()[0];
          const sender = peerConnectionRef.current.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
          
          // Update local stream
          const oldVideoTrack = localStream.getVideoTracks()[0];
          localStream.removeTrack(oldVideoTrack);
          localStream.addTrack(videoTrack);
          setLocalStream(localStream);
        }
      }
    } catch (err) {
      console.error("Error switching camera:", err);
    }
  }, [availableDevices, selectedDevices, localStream]);

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      screenStreamRef.current = screenStream;
      setIsScreenSharing(true);
      
      // Replace video track with screen share
      if (peerConnectionRef.current) {
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = peerConnectionRef.current.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      }
      
      // Notify remote user
      const targetId = selectedUser?._id || callerInfo?.id;
      if (targetId) {
        socket.emit("screen-share-start", {
          from: user._id,
          to: targetId
        });
      }
      
      // Handle screen share stop
      screenStream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
      
    } catch (err) {
      console.error("Error starting screen share:", err);
    }
  }, [selectedUser, callerInfo, socket, user]);

  // Stop screen sharing
  const stopScreenShare = useCallback(() => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    
    setIsScreenSharing(false);
    
    // Restore camera video track
    if (peerConnectionRef.current && localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      const sender = peerConnectionRef.current.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender && videoTrack) {
        sender.replaceTrack(videoTrack);
      }
    }
    
    // Notify remote user
    const targetId = selectedUser?._id || callerInfo?.id;
    if (targetId) {
      socket.emit("screen-share-stop", {
        from: user._id,
        to: targetId
      });
    }
  }, [localStream, selectedUser, callerInfo, socket, user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [localStream]);

  return {
    // State
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
    
    // Refs
    localVideoRef,
    remoteVideoRef,
    
    // Actions
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
    getLocalStream,
    getAvailableDevices,
    
    // Utilities
    formatDuration: (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };
};
