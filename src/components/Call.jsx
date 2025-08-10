
// //the below is final one

// import React, { useState, useRef, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
// import { FaPhone } from "react-icons/fa";
// import { IoMdClose } from "react-icons/io";
// import { useSocket } from "../SocketContext.js";
// import { useNavigate, useParams } from "react-router-dom";

// function Call() {
//   const socket = useSocket();
//   const { user, selectedUsers } = useSelector((store) => store.auth);
//   const [showOverlay, setShowOverlay] = useState(false);
//   const [localStream, setlocalStream] = useState(null);
//   const [remoteStream, setremoteStream] = useState(null);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const navigate = useNavigate();
//   const { id: callUserId } = useParams(); // used when navigating by incoming call

//   // Singleton PeerConnection
//   const PeerConnection = (function () {
//     let peerConnection;
//     const createPeerConnection = () => {
//       const config = {
//         iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//       };
//       peerConnection = new RTCPeerConnection(config);

//       localStream?.getTracks().forEach((track) => {
//         peerConnection.addTrack(track, localStream);
//       });

//       peerConnection.ontrack = (event) => {
//         setremoteStream(event.streams[0]);
//       };

//       peerConnection.onicecandidate = (event) => {
//         if (event.candidate) {
//           socket.emit("icecandidate", {
//             candidate: event.candidate,
//             to: selectedUsers?._id || callUserId,
//           });
//         }
//       };

//       return peerConnection;
//     };

//     return {
     
//       getInstance: () => {
//         if (!peerConnection) peerConnection = createPeerConnection();
//         return peerConnection;
//       },
//       createNew: () => {
//         peerConnection = createPeerConnection();
//         return peerConnection;
//       },
//     };
//   })();

//   // Local stream on load
//   useEffect(() => {
//     const getLocalStream = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });
//         setlocalStream(stream);
//       } catch (err) {
//         console.error("Error getting media stream", err);
//       }
//     };
//     getLocalStream();
//   }, []);

//   useEffect(() => {
//     if (showOverlay && localStream && localVideoRef.current) {
//       localVideoRef.current.srcObject = localStream;
//     }
//   }, [showOverlay, localStream]);

//   useEffect(() => {
//     if (remoteStream && remoteVideoRef.current) {
//       remoteVideoRef.current.srcObject = remoteStream;
//     }
//   }, [remoteStream]);

//   // Offer/Answer handlers
//   useEffect(() => {
//     if (!socket) return;


//     const handleOffer = async ({ from, to, offer }) => {
//       const peer = PeerConnection.getInstance();

//       if (peer.signalingState !== "stable") {
//         console.warn("Peer not stable. Resetting peer connection.");
//         peer.close();
//         peer = PeerConnection.createNew(); // you need to add this method to recreate a new connection
//       }

//       try {
//         await peer.setRemoteDescription(new RTCSessionDescription(offer));
//         const answer = await peer.createAnswer();
//         await peer.setLocalDescription(answer);
//         socket.emit("answer", { from: user._id, to, answer });
//         setShowOverlay(true);
//       } catch (err) {
//         console.error("Error handling offer:", err);
//       }
//     };

  
//     const handleAnswer = async ({ from, to, answer }) => {
//       const peer = PeerConnection.getInstance();

//       // Avoid setting remote answer if already in 'stable' state
//       if (peer.signalingState !== "stable") {
//         try {
//           await peer.setRemoteDescription(new RTCSessionDescription(answer));
//         } catch (err) {
//           console.error("Failed to set remote answer:", err);
//         }
//       } else {
//         console.warn(
//           "Peer already in stable state. Skipping setting remote answer."
//         );
//       }
//     };

//     const handleICE = async (candidate) => {
//       if (candidate) {
//         try {
//           const peer = PeerConnection.getInstance();
//           await peer.addIceCandidate(new RTCIceCandidate(candidate));
//         } catch (err) {
//           console.error("Error adding ICE candidate", err);
//         }
//       }
//     };

//     socket.on("offer", handleOffer);
//     socket.on("answer", handleAnswer);
//     socket.on("icecandidate", handleICE);

//     return () => {
//       socket.off("offer", handleOffer);
//       socket.off("answer", handleAnswer);
//       socket.off("icecandidate", handleICE);
//     };
//   }, [socket, localStream]);

//   // 📞 Start a call only after accepted
//   const startCall = () => {
//     socket.emit("call-user", {
//       from: user._id,
//       to: selectedUsers._id,
//       userInfo: {
//         name: user.name,
//         profilePicture: user.profilePicture,
//       },
//     });

//     socket.on("call-accepted", async ({ to }) => {
//       const peer = PeerConnection.getInstance();
//       const offer = await peer.createOffer();
//       await peer.setLocalDescription(offer);

//       socket.emit("offer", {
//         from: user._id,
//         to: selectedUsers._id,
//         offer: peer.localDescription,
//       });

//       setShowOverlay(true);
//     });

//     socket.on("call-rejected", ({ to }) => {
//       alert("User rejected the call.");
//       setShowOverlay(false);
//     });
//   };

//   const handleCloseOverlay = () => {
//     setShowOverlay(false);
//     window.location.href = "/conversation"; // optional route redirect
//   };

//   return (
//     <div className="flex flex-col items-center mt-40 ml-[250px] gap-2">
//       <div className="flex flex-col items-center h-[400px] bg-gray-500 w-[380px] text-white pt-10 rounded-[12px] gap-6">
//         <Avatar className="h-40 w-40">
//           <AvatarImage
//             src={selectedUsers?.profilePicture}
//             className="object-cover w-full h-full rounded-full"
//           />
//           <AvatarFallback>U</AvatarFallback>
//         </Avatar>
//         <div className="flex flex-col text-[26px] font-bold">
//           {selectedUsers?.name}
//           <span className="text-[16px] font-semibold">Ready to call?</span>
//         </div>
//         <button
//           onClick={startCall}
//           className="bg-black text-white p-3 rounded-full hover:scale-110 transition"
//         >
//           <FaPhone size={28} />
//         </button>
//       </div>

//       {showOverlay && (
//         <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
//           <button
//             onClick={handleCloseOverlay}
//             className="absolute top-4 right-4 text-white text-3xl"
//           >
//             <IoMdClose />
//           </button>
//           <div className="flex gap-4">
//             <div className="w-[700px] h-[525px] bg-black rounded-lg shadow-lg">
//               <video
//                 ref={localVideoRef}
//                 autoPlay
//                 playsInline
//                 className="w-full h-full rounded-lg"
//               ></video>
//             </div>
//             <div className="w-[700px] h-[525px] bg-black rounded-lg shadow-lg">
//               <video
//                 ref={remoteVideoRef}
//                 autoPlay
//                 playsInline
//                 className="w-full h-full rounded-lg"
//               ></video>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Call;

// import React, { useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
// import { FaPhone } from "react-icons/fa";
// import { IoMdClose } from "react-icons/io";
// import { useSocket } from "../SocketContext.js";
// import { useNavigate, useParams } from "react-router-dom";

// const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

// function Call() {
//   const socket = useSocket();
//   const { user, selectedUsers } = useSelector((store) => store.auth);
//   const [showOverlay, setShowOverlay] = useState(false);
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [incomingCall, setIncomingCall] = useState(null); // { from, userInfo }
//   const [isCalling, setIsCalling] = useState(false);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const peerRef = useRef(null); // RTCPeerConnection
//   const navigate = useNavigate();
//   const { id: callUserId } = useParams(); // optional: if navigating from incoming call link

//   // get local media once
//   useEffect(() => {
//     let mounted = true;
//     const initLocalStream = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });
//         if (!mounted) return;
//         setLocalStream(stream);
//       } catch (err) {
//         console.error("Error getting media stream", err);
//       }
//     };
//     initLocalStream();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // attach local stream to video element
//   useEffect(() => {
//     if (localVideoRef.current && localStream) {
//       localVideoRef.current.srcObject = localStream;
//     }
//   }, [localStream]);

//   // attach remote stream
//   useEffect(() => {
//     if (remoteVideoRef.current && remoteStream) {
//       remoteVideoRef.current.srcObject = remoteStream;
//     }
//   }, [remoteStream]);

//   // create a fresh RTCPeerConnection and set handlers
//   const createPeerConnection = (remoteUserId) => {
//     // close old one if existed
//     if (peerRef.current) {
//       try {
//         peerRef.current.ontrack = null;
//         peerRef.current.onicecandidate = null;
//         peerRef.current.close();
//       } catch (err) {
//         // ignore
//       }
//       peerRef.current = null;
//     }

//     const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

//     // add local tracks if available
//     if (localStream) {
//       localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));
//     } else {
//       console.warn("Local stream not ready when creating peer. Add tracks later.");
//     }

//     // when remote track arrives
//     pc.ontrack = (event) => {
//       setRemoteStream(event.streams && event.streams[0] ? event.streams[0] : event.streams);
//     };

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("icecandidate", {
//           candidate: event.candidate,
//           to: remoteUserId,
//         });
//       }
//     };

//     // helpful debugging
//     pc.onconnectionstatechange = () => {
//       console.log("PC connectionState:", pc.connectionState);
//       if (pc.connectionState === "disconnected" || pc.connectionState === "failed" || pc.connectionState === "closed") {
//         cleanupCall();
//       }
//     };

//     peerRef.current = pc;
//     return pc;
//   };

//   // If localStream becomes available and peer exists but tracks not added, add them
//   useEffect(() => {
//     if (localStream && peerRef.current) {
//       const senders = peerRef.current.getSenders();
//       const hasVideoSender = senders.some((s) => s.track && s.track.kind === "video");
//       if (!hasVideoSender) {
//         localStream.getTracks().forEach((t) => peerRef.current.addTrack(t, localStream));
//       }
//       if (localVideoRef.current && !localVideoRef.current.srcObject) {
//         localVideoRef.current.srcObject = localStream;
//       }
//     }
//   }, [localStream]);

//   // Socket listeners: incoming-call, offer, answer, icecandidate, call-accepted/rejected
//   useEffect(() => {
//     if (!socket) return;

//     const onIncomingCall = ({ from, userInfo }) => {
//       console.log("incoming-call", from, userInfo);
//       setIncomingCall({ from, userInfo });
//     };

//     const onOffer = async ({ from, offer }) => {
//       console.log("received offer from", from);
//       const pc = peerRef.current || createPeerConnection(from);
//       try {
//         await pc.setRemoteDescription(new RTCSessionDescription(offer));
//         const answer = await pc.createAnswer();
//         await pc.setLocalDescription(answer);

//         socket.emit("answer", {
//           from: user._id, // me (callee)
//           to: from, // offerer
//           answer: pc.localDescription,
//         });

//         setShowOverlay(true);
//         setIsCalling(true);
//       } catch (err) {
//         console.error("Error handling offer:", err);
//       }
//     };

//     const onAnswer = async ({ from, answer }) => {
//       console.log("received answer from", from);
//       const pc = peerRef.current;
//       if (!pc) {
//         console.warn("No peer when receiving answer");
//         return;
//       }
//       try {
//         await pc.setRemoteDescription(new RTCSessionDescription(answer));
//       } catch (err) {
//         console.error("Failed to set remote answer:", err);
//       }
//     };

//     const onICE = async (candidate) => {
//       if (!candidate) return;
//       try {
//         const pc = peerRef.current;
//         if (pc) {
//           await pc.addIceCandidate(new RTCIceCandidate(candidate));
//         }
//       } catch (err) {
//         console.error("Error adding remote ICE candidate", err);
//       }
//     };

//     const onCallAccepted = async ({ from }) => {
//       // Caller receives this when callee accepts
//       // 'from' is callee id, 'to' is caller id (should be me)
//       console.log("call-accepted", { from });
//       try {
//         const pc = peerRef.current || createPeerConnection(from);
//         const offer = await pc.createOffer();
//         await pc.setLocalDescription(offer);

//         socket.emit("offer", {
//           from: user._id, // caller id (me)
//           to: from, // callee id
//           offer: pc.localDescription,
//         });

//         setShowOverlay(true);
//         setIsCalling(true);
//       } catch (err) {
//         console.error("Error on call-accepted flow:", err);
//       }
//     };

//     const onCallRejected = ({ from }) => {
//       alert("User rejected the call.");
//       cleanupCall();
//     };

//     socket.on("incoming-call", onIncomingCall);
//     socket.on("offer", onOffer);
//     socket.on("answer", onAnswer);
//     socket.on("icecandidate", onICE);
//     socket.on("call-accepted", onCallAccepted);
//     socket.on("call-rejected", onCallRejected);

//     return () => {
//       socket.off("incoming-call", onIncomingCall);
//       socket.off("offer", onOffer);
//       socket.off("answer", onAnswer);
//       socket.off("icecandidate", onICE);
//       socket.off("call-accepted", onCallAccepted);
//       socket.off("call-rejected", onCallRejected);
//     };
//   }, [socket, localStream, user]);

//   const cleanupCall = () => {
//     setShowOverlay(false);
//     setIsCalling(false);
//     setIncomingCall(null);
//     setRemoteStream(null);

//     if (peerRef.current) {
//       try {
//         peerRef.current.ontrack = null;
//         peerRef.current.onicecandidate = null;
//         peerRef.current.close();
//       } catch (err) {
//         // ignore
//       }
//       peerRef.current = null;
//     }
//   };

//   const acceptCall = async () => {
//     if (!incomingCall) return;
//     const { from } = incomingCall;
//     createPeerConnection(from);
//     socket.emit("call-accepted", {
//       from: user._id, // callee id (me)
//       to: from, // caller id
//     });
//     setIncomingCall(null);
//     setShowOverlay(true);
//     setIsCalling(true);
//   };

//   const rejectCall = () => {
//     if (!incomingCall) return;
//     const { from } = incomingCall;
//     socket.emit("call-rejected", {
//       from: user._id, // callee id
//       to: from, // caller id
//     });
//     setIncomingCall(null);
//     cleanupCall();
//   };

//   const startCall = async () => {
//     if (!selectedUsers || !selectedUsers._id) {
//       alert("Select a user to call.");
//       return;
//     }
//     const remoteUserId = selectedUsers._id;
    
//     // Create peer here so we can add tracks
//     createPeerConnection(remoteUserId);

//     socket.emit("call-user", {
//       from: user._id,
//       to: remoteUserId,
//       userInfo: {
//         name: user.name,
//         profilePicture: user.profilePicture,
//       },
//     });
//   };

//   const handleCloseOverlay = () => {
//     cleanupCall();
//     navigate("/conversation");
//   };

//   return (
//     <div className="flex flex-col items-center mt-40 ml-[250px] gap-2">
//       <div className="flex flex-col items-center h-[400px] bg-gray-500 w-[380px] text-white pt-10 rounded-[12px] gap-6">
//         <Avatar className="h-40 w-40">
//           <AvatarImage
//             src={selectedUsers?.profilePicture}
//             className="object-cover w-full h-full rounded-full"
//           />
//           <AvatarFallback>U</AvatarFallback>
//         </Avatar>
//         <div className="flex flex-col text-[26px] font-bold">
//           {selectedUsers?.name}
//           <span className="text-[16px] font-semibold">Ready to call?</span>
//         </div>
//         <button
//           onClick={startCall}
//           className="bg-black text-white p-3 rounded-full hover:scale-110 transition"
//         >
//           <FaPhone size={28} />
//         </button>
//       </div>

//       {incomingCall && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
//           <div className="bg-white rounded p-6 text-center">
//             <h2 className="text-xl font-bold">
//               {incomingCall.userInfo?.name || "Someone"} is calling...
//             </h2>
//             <div className="flex gap-4 justify-center mt-4">
//               <button
//                 onClick={acceptCall}
//                 className="bg-green-600 text-white px-4 py-2 rounded"
//               >
//                 Accept
//               </button>
//               <button
//                 onClick={rejectCall}
//                 className="bg-red-600 text-white px-4 py-2 rounded"
//               >
//                 Reject
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showOverlay && (
//         <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
//           <button
//             onClick={handleCloseOverlay}
//             className="absolute top-4 right-4 text-white text-3xl"
//           >
//             <IoMdClose />
//           </button>
//           <div className="flex gap-4">
//             <div className="w-[700px] h-[525px] bg-black rounded-lg shadow-lg">
//               <video
//                 ref={localVideoRef}
//                 autoPlay
//                 playsInline
//                 muted
//                 className="w-full h-full rounded-lg object-cover"
//               />
//             </div>
//             <div className="w-[700px] h-[525px] bg-black rounded-lg shadow-lg">
//               <video
//                 ref={remoteVideoRef}
//                 autoPlay
//                 playsInline
//                 className="w-full h-full rounded-lg object-cover"
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Call;

// import React, { useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
// import { FaPhone } from "react-icons/fa";
// import { IoMdClose } from "react-icons/io";
// import { useSocket } from "../SocketContext.js";
// import { useNavigate, useParams } from "react-router-dom";

// const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

// function Call() {
//   const socket = useSocket();
//   const { user, selectedUsers } = useSelector((store) => store.auth);
//   const [showOverlay, setShowOverlay] = useState(false);
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [incomingCall, setIncomingCall] = useState(null);
//   const [isCalling, setIsCalling] = useState(false);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const peerRef = useRef(null);
//   const navigate = useNavigate();
//   const { id: callUserId } = useParams();

//   // Initialize local stream once
//   const initLocalStream = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       setLocalStream(stream);
//     } catch (err) {
//       console.error("Error getting media stream", err);
//     }
//   };

//   useEffect(() => {
//     initLocalStream();
//     return () => {
//       cleanupCall();
//     };
//   }, []);

//   // Attach local stream to video
//   useEffect(() => {
//     if (localVideoRef.current && localStream) {
//       localVideoRef.current.srcObject = localStream;
//     }
//   }, [localStream]);

//   // Attach remote stream to video
//   useEffect(() => {
//     if (remoteVideoRef.current && remoteStream) {
//       remoteVideoRef.current.srcObject = remoteStream;
//     }
//   }, [remoteStream]);

//   const createPeerConnection = (remoteUserId) => {
//     if (peerRef.current) {
//       try {
//         peerRef.current.ontrack = null;
//         peerRef.current.onicecandidate = null;
//         peerRef.current.close();
//       } catch {}
//       peerRef.current = null;
//     }

//     const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

//     if (localStream) {
//       localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));
//     }

//     pc.ontrack = (event) => {
//       setRemoteStream(event.streams[0]);
//     };

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("icecandidate", {
//           candidate: event.candidate,
//           to: remoteUserId,
//         });
//       }
//     };

//     pc.onconnectionstatechange = () => {
//       console.log("PC connectionState:", pc.connectionState);
//       if (["disconnected", "failed", "closed"].includes(pc.connectionState)) {
//         cleanupCall();
//       }
//     };

//     peerRef.current = pc;
//     return pc;
//   };

//   // Add tracks if they weren't ready initially
//   useEffect(() => {
//     if (localStream && peerRef.current) {
//       const senders = peerRef.current.getSenders();
//       const hasVideoSender = senders.some((s) => s.track && s.track.kind === "video");
//       if (!hasVideoSender) {
//         localStream.getTracks().forEach((t) => peerRef.current.addTrack(t, localStream));
//       }
//     }
//   }, [localStream]);

//   // Socket listeners
//   useEffect(() => {
//     if (!socket) return;

//     const onIncomingCall = ({ from, userInfo }) => {
//       setIncomingCall({ from, userInfo });
//     };

//     const onOffer = async ({ from, offer }) => {
//       const pc = peerRef.current || createPeerConnection(from);
//       await pc.setRemoteDescription(new RTCSessionDescription(offer));
//       const answer = await pc.createAnswer();
//       await pc.setLocalDescription(answer);
//       socket.emit("answer", { from: user._id, to: from, answer: pc.localDescription });
//       setShowOverlay(true);
//       setIsCalling(true);
//     };

//     const onAnswer = async ({ from, answer }) => {
//       const pc = peerRef.current;
//       if (pc) {
//         await pc.setRemoteDescription(new RTCSessionDescription(answer));
//       }
//     };

//     const onICE = async (candidate) => {
//       if (candidate && peerRef.current) {
//         await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
//       }
//     };

//     const onCallAccepted = async ({ from }) => {
//       const pc = peerRef.current || createPeerConnection(from);
//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);
//       socket.emit("offer", { from: user._id, to: from, offer: pc.localDescription });
//       setShowOverlay(true);
//       setIsCalling(true);
//     };

//     const onCallRejected = () => {
//       alert("User rejected the call.");
//       cleanupCall();
//     };

//     socket.on("incoming-call", onIncomingCall);
//     socket.on("offer", onOffer);
//     socket.on("answer", onAnswer);
//     socket.on("icecandidate", onICE);
//     socket.on("call-accepted", onCallAccepted);
//     socket.on("call-rejected", onCallRejected);

//     return () => {
//       socket.off("incoming-call", onIncomingCall);
//       socket.off("offer", onOffer);
//       socket.off("answer", onAnswer);
//       socket.off("icecandidate", onICE);
//       socket.off("call-accepted", onCallAccepted);
//       socket.off("call-rejected", onCallRejected);
//     };
//   }, [socket, localStream, user]);

//   const cleanupCall = () => {
//     setShowOverlay(false);
//     setIsCalling(false);
//     setIncomingCall(null);
//     setRemoteStream(null);

//     if (peerRef.current) {
//       try {
//         peerRef.current.ontrack = null;
//         peerRef.current.onicecandidate = null;
//         peerRef.current.close();
//       } catch {}
//       peerRef.current = null;
//     }

//     if (localStream) {
//       localStream.getTracks().forEach((track) => track.stop());
//       setLocalStream(null);
//     }
//   };

//   const acceptCall = async () => {
//     if (!incomingCall) return;
//     if (!localStream) await initLocalStream();
//     createPeerConnection(incomingCall.from);
//     socket.emit("call-accepted", { from: user._id, to: incomingCall.from });
//     setIncomingCall(null);
//     setShowOverlay(true);
//     setIsCalling(true);
//   };

//   const rejectCall = () => {
//     if (!incomingCall) return;
//     socket.emit("call-rejected", { from: user._id, to: incomingCall.from });
//     setIncomingCall(null);
//     cleanupCall();
//   };

//   const startCall = async () => {
//     if (!selectedUsers || !selectedUsers._id) {
//       alert("Select a user to call.");
//       return;
//     }
//     if (!localStream) await initLocalStream();
//     createPeerConnection(selectedUsers._id);
//     socket.emit("call-user", {
//       from: user._id,
//       to: selectedUsers._id,
//       userInfo: { name: user.name, profilePicture: user.profilePicture },
//     });
//   };

//   const handleCloseOverlay = () => {
//     cleanupCall();
//     navigate("/conversation");
//   };

//   return (
//     <div className="flex flex-col items-center mt-40 ml-[250px] gap-2">
//       <div className="flex flex-col items-center h-[400px] bg-gray-500 w-[380px] text-white pt-10 rounded-[12px] gap-6">
//         <Avatar className="h-40 w-40">
//           <AvatarImage src={selectedUsers?.profilePicture} className="object-cover w-full h-full rounded-full" />
//           <AvatarFallback>U</AvatarFallback>
//         </Avatar>
//         <div className="flex flex-col text-[26px] font-bold">
//           {selectedUsers?.name}
//           <span className="text-[16px] font-semibold">Ready to call?</span>
//         </div>
//         <button onClick={startCall} className="bg-black text-white p-3 rounded-full hover:scale-110 transition">
//           <FaPhone size={28} />
//         </button>
//       </div>

//       {incomingCall && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
//           <div className="bg-white rounded p-6 text-center">
//             <h2 className="text-xl font-bold">
//               {incomingCall.userInfo?.name || "Someone"} is calling...
//             </h2>
//             <div className="flex gap-4 justify-center mt-4">
//               <button onClick={acceptCall} className="bg-green-600 text-white px-4 py-2 rounded">Accept</button>
//               <button onClick={rejectCall} className="bg-red-600 text-white px-4 py-2 rounded">Reject</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showOverlay && (
//         <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
//           <button onClick={handleCloseOverlay} className="absolute top-4 right-4 text-white text-3xl">
//             <IoMdClose />
//           </button>
//           <div className="flex gap-4">
//             <div className="w-[700px] h-[525px] bg-black rounded-lg shadow-lg">
//               <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full rounded-lg object-cover" />
//             </div>
//             <div className="w-[700px] h-[525px] bg-black rounded-lg shadow-lg">
//               <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full rounded-lg object-cover" />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Call;
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FaPhone, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useSocket } from "../SocketContext.js";
import { useNavigate, useParams } from "react-router-dom";

const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

function Call() {
  const socket = useSocket();
  const { user, selectedUsers } = useSelector((store) => store.auth);
  
  // UI States
  const [showOverlay, setShowOverlay] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState(""); // "calling", "connecting", "connected", "ended"
  
  // Media States
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  
  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const isInitializingRef = useRef(false);
  const callTimeoutRef = useRef(null);
  
  const navigate = useNavigate();
  const { id: callUserId } = useParams();

  // Initialize local media stream
  const initLocalStream = useCallback(async () => {
    if (isInitializingRef.current || localStream) return localStream;
    
    isInitializingRef.current = true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
      });
      
      setLocalStream(stream);
      console.log("Local stream initialized successfully");
      return stream;
    } catch (err) {
      console.error("Error getting media stream:", err);
      alert("Failed to access camera/microphone. Please check permissions.");
      throw err;
    } finally {
      isInitializingRef.current = false;
    }
  }, [localStream]);

  // Initialize component
  useEffect(() => {
    initLocalStream().catch(console.error);
    
    return () => {
      cleanupCall();
    };
  }, [initLocalStream]);

  // Attach streams to video elements
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Create peer connection
  const createPeerConnection = useCallback((remoteUserId, stream = null) => {
    console.log("Creating peer connection for:", remoteUserId);
    
    // Clean up existing connection
    if (peerRef.current) {
      try {
        peerRef.current.ontrack = null;
        peerRef.current.onicecandidate = null;
        peerRef.current.onconnectionstatechange = null;
        peerRef.current.close();
      } catch (err) {
        console.warn("Error closing existing peer connection:", err);
      }
    }

    const pc = new RTCPeerConnection({ 
      iceServers: ICE_SERVERS,
      iceCandidatePoolSize: 10
    });

    // Add local tracks
    const streamToUse = stream || localStream;
    if (streamToUse) {
      streamToUse.getTracks().forEach((track) => {
        console.log("Adding track:", track.kind);
        pc.addTrack(track, streamToUse);
      });
    } else {
      console.warn("No local stream available when creating peer connection");
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log("Received remote track:", event.track.kind);
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
        setCallStatus("connected");
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate");
        socket.emit("icecandidate", {
          candidate: event.candidate,
          to: remoteUserId,
        });
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log("Connection state:", pc.connectionState);
      switch (pc.connectionState) {
        case "connected":
          setCallStatus("connected");
          break;
        case "disconnected":
        case "failed":
        case "closed":
          setCallStatus("ended");
          setTimeout(cleanupCall, 1000);
          break;
        case "connecting":
          setCallStatus("connecting");
          break;
      }
    };

    // Handle ICE connection state
    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
      if (pc.iceConnectionState === "failed") {
        console.log("ICE connection failed, attempting restart");
        pc.restartIce();
      }
    };

    peerRef.current = pc;
    return pc;
  }, [localStream, socket]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = ({ from, userInfo }) => {
      console.log("Incoming call from:", from, userInfo);
      setIncomingCall({ from, userInfo });
      setCallStatus("incoming");
    };

    const handleOffer = async ({ from, offer }) => {
      console.log("Received offer from:", from);
      try {
        // Ensure we have local stream before handling offer
        const stream = localStream || await initLocalStream();
        const pc = createPeerConnection(from, stream);
        
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("answer", {
          from: user._id,
          to: from,
          answer: pc.localDescription,
        });

        setShowOverlay(true);
        setIsCalling(true);
        setCallStatus("connecting");
      } catch (err) {
        console.error("Error handling offer:", err);
        alert("Failed to handle incoming call");
      }
    };

    const handleAnswer = async ({ from, answer }) => {
      console.log("Received answer from:", from);
      const pc = peerRef.current;
      if (!pc) {
        console.warn("No peer connection when receiving answer");
        return;
      }

      try {
        if (pc.signalingState === "have-local-offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          setCallStatus("connecting");
        } else {
          console.warn("Unexpected signaling state:", pc.signalingState);
        }
      } catch (err) {
        console.error("Failed to set remote answer:", err);
      }
    };

    const handleICECandidate = async (candidate) => {
      if (!candidate || !peerRef.current) return;
      
      try {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("Added ICE candidate");
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    };

    const handleCallAccepted = async ({ from }) => {
      console.log("Call accepted by:", from);
      try {
        // Clear any existing timeout
        if (callTimeoutRef.current) {
          clearTimeout(callTimeoutRef.current);
        }

        // Ensure we have local stream
        const stream = localStream || await initLocalStream();
        const pc = createPeerConnection(from, stream);
        
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await pc.setLocalDescription(offer);

        socket.emit("offer", {
          from: user._id,
          to: from,
          offer: pc.localDescription,
        });

        setShowOverlay(true);
        setIsCalling(true);
        setCallStatus("connecting");
      } catch (err) {
        console.error("Error on call accepted:", err);
        alert("Failed to establish call connection");
      }
    };

    const handleCallRejected = ({ from }) => {
      console.log("Call rejected by:", from);
      alert("Call was rejected");
      cleanupCall();
    };

    // Register socket listeners
    socket.on("incoming-call", handleIncomingCall);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("icecandidate", handleICECandidate);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("call-rejected", handleCallRejected);

    return () => {
      socket.off("incoming-call", handleIncomingCall);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("icecandidate", handleICECandidate);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("call-rejected", handleCallRejected);
    };
  }, [socket, user, localStream, createPeerConnection, initLocalStream]);

  // Cleanup function
  const cleanupCall = useCallback(() => {
    console.log("Cleaning up call");
    
    setShowOverlay(false);
    setIsCalling(false);
    setIncomingCall(null);
    setCallStatus("");
    
    // Clear timeout
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }

    // Clean up peer connection
    if (peerRef.current) {
      try {
        peerRef.current.ontrack = null;
        peerRef.current.onicecandidate = null;
        peerRef.current.onconnectionstatechange = null;
        peerRef.current.close();
      } catch (err) {
        console.warn("Error closing peer connection:", err);
      }
      peerRef.current = null;
    }

    // Clean up remote stream
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (err) {
          console.warn("Error stopping remote track:", err);
        }
      });
      setRemoteStream(null);
    }

    // Note: We keep localStream active for potential future calls
    // Only stop it when component unmounts
  }, [remoteStream]);

  // Accept incoming call
  const acceptCall = useCallback(async () => {
    if (!incomingCall) return;
    
    console.log("Accepting call from:", incomingCall.from);
    try {
      // Ensure we have local stream
      const stream = localStream || await initLocalStream();
      createPeerConnection(incomingCall.from, stream);
      
      socket.emit("call-accepted", {
        from: user._id,
        to: incomingCall.from,
      });
      
      setIncomingCall(null);
      setShowOverlay(true);
      setIsCalling(true);
      setCallStatus("connecting");
    } catch (err) {
      console.error("Error accepting call:", err);
      alert("Failed to accept call");
    }
  }, [incomingCall, localStream, createPeerConnection, initLocalStream, socket, user._id]);

  // Reject incoming call
  const rejectCall = useCallback(() => {
    if (!incomingCall) return;
    
    console.log("Rejecting call from:", incomingCall.from);
    socket.emit("call-rejected", {
      from: user._id,
      to: incomingCall.from,
    });
    
    setIncomingCall(null);
    cleanupCall();
  }, [incomingCall, socket, user._id, cleanupCall]);

  // Start outgoing call
  const startCall = useCallback(async () => {
    if (!selectedUsers || !selectedUsers._id) {
      alert("Please select a user to call.");
      return;
    }

    console.log("Starting call to:", selectedUsers._id);
    try {
      // Ensure we have local stream
      const stream = localStream || await initLocalStream();
      createPeerConnection(selectedUsers._id, stream);
      
      socket.emit("call-user", {
        from: user._id,
        to: selectedUsers._id,
        userInfo: {
          name: user.name,
          profilePicture: user.profilePicture,
        },
      });

      setCallStatus("calling");
      
      // Set timeout for call response (30 seconds)
      callTimeoutRef.current = setTimeout(() => {
        alert("Call timeout - no response");
        cleanupCall();
      }, 30000);
      
    } catch (err) {
      console.error("Error starting call:", err);
      alert("Failed to start call");
    }
  }, [selectedUsers, localStream, createPeerConnection, initLocalStream, socket, user, cleanupCall]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, [localStream]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, [localStream]);

  // End call
  const handleCloseOverlay = useCallback(() => {
    cleanupCall();
    navigate("/conversation");
  }, [cleanupCall, navigate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => {
          try {
            track.stop();
          } catch (err) {
            console.warn("Error stopping local track:", err);
          }
        });
      }
      cleanupCall();
    };
  }, [localStream, cleanupCall]);

  return (
    <div className="flex flex-col items-center mt-40 ml-[250px] gap-2">
      <div className="flex flex-col items-center h-[400px] bg-gray-500 w-[380px] text-white pt-10 rounded-[12px] gap-6">
        <Avatar className="h-40 w-40">
          <AvatarImage
            src={selectedUsers?.profilePicture}
            className="object-cover w-full h-full rounded-full"
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-[26px] font-bold text-center">
          {selectedUsers?.name}
          <span className="text-[16px] font-semibold">
            {callStatus === "calling" ? "Calling..." : "Ready to call?"}
          </span>
        </div>
        <button
          onClick={startCall}
          disabled={callStatus === "calling"}
          className="bg-black text-white p-3 rounded-full hover:scale-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPhone size={28} />
        </button>
      </div>

      {/* Incoming Call Modal */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 text-center max-w-sm w-full mx-4">
            <div className="mb-4">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarImage
                  src={incomingCall.userInfo?.profilePicture}
                  className="object-cover w-full h-full rounded-full"
                />
                <AvatarFallback>{incomingCall.userInfo?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-gray-800">
                {incomingCall.userInfo?.name || "Someone"} is calling...
              </h2>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={acceptCall}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition"
              >
                <FaPhone size={20} />
              </button>
              <button
                onClick={rejectCall}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full transition"
              >
                <IoMdClose size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Call Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black flex justify-center items-center z-50">
          {/* Call Status */}
          <div className="absolute top-4 left-4 text-white z-10">
            <span className="bg-black bg-opacity-50 px-3 py-1 rounded">
              Status: {callStatus || "connecting..."}
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={handleCloseOverlay}
            className="absolute top-4 right-4 text-white text-3xl hover:text-red-500 transition z-10"
          >
            <IoMdClose />
          </button>

          {/* Video Containers */}
          <div className="flex gap-4 h-full w-full p-4">
            {/* Remote Video (Main) */}
            <div className="flex-1 bg-gray-900 rounded-lg shadow-lg relative overflow-hidden">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {!remoteStream && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Waiting for remote video...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Local Video (Picture-in-Picture) */}
            <div className="w-80 h-60 bg-gray-900 rounded-lg shadow-lg relative overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {!isVideoEnabled && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <FaVideoSlash className="text-white text-2xl" />
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full transition ${
                isAudioEnabled ? "bg-gray-700 hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              {isAudioEnabled ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
            </button>
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition ${
                isVideoEnabled ? "bg-gray-700 hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              {isVideoEnabled ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
            </button>
            <button
              onClick={handleCloseOverlay}
              className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition"
            >
              <IoMdClose size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Call;