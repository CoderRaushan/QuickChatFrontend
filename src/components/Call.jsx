// import React, { useState, useRef, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
// import { FaPhone } from "react-icons/fa"; // Call icon
// import { IoMdClose } from "react-icons/io"; // Close icon
// import { useSocket } from "../SocketContext.js";
// function Call() {
//   const socket = useSocket();
//   const { selectedUsers,user } = useSelector((store) => store.auth);
//   const [showOverlay, setShowOverlay] = useState(false);
//   const [localStream, setlocalStream] = useState(null);
//   const [remoteStream, setremoteStream] = useState(null);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);

//   //singleton method
//   const PeerConnecetion = (function () {
//     let peerConnecetion;
//     const createPeerConnection = () => {
//       const config = {
//         iceServers: [
//           {
//             urls: "stun:stun.l.google.com:19302",
//           },
//         ],
//       };
//       peerConnecetion = new RTCPeerConnection(config);
//       //add local stream to peer connection
//       localStream.getTracks().forEach((track) => {
//         peerConnecetion.addTrack(track, localStream);
//       });
//       // listen to the reomote stream and add  to peer connection
//       peerConnecetion.ontrack = function (event) {
//         setremoteStream(event.streams[0]);
//       };
//       //listen for ice candidate
//       peerConnecetion.onicecandidate = function (event) {
//         const candidate = event.candidate;
//         if (candidate) {
//           socket.emit("icecandidate", {
//             candidate,
//             to: selectedUsers?._id,
//           });
//         }
//       };
//       return peerConnecetion;
//     };
//     return {
//       getInstance: () => {
//         if (!peerConnecetion) {
//           peerConnecetion = createPeerConnection();
//         }
//         return peerConnecetion;
//       },
//     };
//   })();

//   const handleCallClick = () => {
//     setShowOverlay(true);
//   };

//   const handleCloseOverlay = () => {
//     setShowOverlay(false);
//   };
//   //if (!socket || !socket.connected || !selectedUsers) return;
//   useEffect(() => {
//     const getLocalStream = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           audio: true,
//           video: true,
//         });
//         setlocalStream(stream);
//       } catch (error) {
//         console.error("Error accessing media devices.", error);
//       }
//     };

//     getLocalStream();
//   }, []);

//   useEffect(() => {
//     if (showOverlay && localStream && localVideoRef.current) {
//       localVideoRef.current.srcObject = localStream;
//     }
//   }, [showOverlay, localStream]);

//   socket.on("offer", async ({ from, to, offer }) => {
//     const peer = PeerConnecetion.getInstance();
//     //set remote description
//     await peer.setRemoteDescription(offer);
//     const answer = await peer.createAnswer();
//     await peer.setLocalDescription(answer);
//     socket.emit("answer", { from, to, answer: peer.localDescription });
//   });

//   socket.on("answer", async ({ from, to, answer }) => {
//     const peer = PeerConnecetion.getInstance();
//     await peer.setRemoteDescription(answer);
//   });
//   useEffect(() => {
//     if (!socket) return;

//     socket.on("icecandidate", async (candidate) => {
//       if (candidate) {
//         try {
//           const peer = PeerConnecetion.getInstance();
//           await peer.addIceCandidate(new RTCIceCandidate(candidate));
//           console.log("ICE candidate added!");
//         } catch (err) {
//           console.error("Error adding ICE candidate", err);
//         }
//       }
//     });

//     // Cleanup listener when component unmounts
//     return () => {
//       socket.off("icecandidate");
//     };
//   }, [socket]);

//   useEffect(() => {
//     if (remoteStream && remoteVideoRef.current) {
//       remoteVideoRef.current.srcObject = remoteStream;
//     }
//   }, [remoteStream]);

//   const startCall = async (callingId) => {
//     const peer = PeerConnecetion.getInstance();
//     const offer = await peer.createOffer();
//     await peer.setLocalDescription(offer);
//     socket.emit("offer", {
//       from: user?._id,
//       to: selectedUsers?._id,
//       offer: peer.localDescription,
//     });
//   };
//   return (
//     <div className="flex flex-col items-center mt-40 ml-[250px] gap-2">
//       {/* Avatar */}
//       <div
//         className="flex flex-col items-center h-[400px]
//       bg-gray-500 w-[380px] text-white pt-10 rounded-[12px] gap-6"
//       >
//         <Avatar className="h-40 w-40">
//           <AvatarImage
//             src={selectedUsers?.profilePicture}
//             className="object-cover w-full h-full rounded-full"
//           />
//           <AvatarFallback>U</AvatarFallback>
//         </Avatar>

//         {/* Username */}
//         <div className=" flex flex-col text-[26px] font-bold">
//           {selectedUsers?.name}
//           <span className="text-[16px] font-semibold">Ready to call?</span>
//         </div>

//         {/* Call Icon Button */}
//         <button
//           onClick={() => {
//             handleCallClick();
//             startCall(selectedUsers?._id);
//           }}
//           className="bg-black text-white p-3 rounded-full hover:scale-110 transition"
//         >
//           <FaPhone size={28} />
//         </button>
//       </div>

//       {/* Overlay */}
//       {showOverlay && (
//         <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
//           {/* Close Button */}
//           <button
//             onClick={handleCloseOverlay}
//             className="absolute top-4 right-4 text-white text-3xl"
//           >
//             <IoMdClose />
//           </button>

//           {/* Video Containers */}
//           <div className="flex gap-4">
//             <div className="w-[700px] h-[525px] bg-black rounded-lg shadow-lg">
//               {/* Your Video */}
//               <video
//                 ref={localVideoRef}
//                 autoPlay
//                 muted
//                 playsInline
//                 className="w-full h-full rounded-lg"
//               ></video>
//               {/* <p className="text-white text-center pt-2">You</p> */}
//             </div>
//             <div className="w-[700px] h-[525px] bg-black rounded-lg shadow-lg">
//               {/* Other Person's Video */}
//               <video
//                 ref={remoteVideoRef}
//                 autoPlay
//                 playsInline
//                 className="w-full h-full rounded-lg"
//               ></video>
//               {/* <p className="text-white text-center pt-2">
//                 {selectedUsers?.username}
//               </p> */}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Call;
//the below is final one

import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FaPhone } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useSocket } from "../SocketContext.js";
import { useNavigate, useParams } from "react-router-dom";

function Call() {
  const socket = useSocket();
  const { user, selectedUsers } = useSelector((store) => store.auth);
  const [showOverlay, setShowOverlay] = useState(false);
  const [localStream, setlocalStream] = useState(null);
  const [remoteStream, setremoteStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const navigate = useNavigate();
  const { id: callUserId } = useParams(); // used when navigating by incoming call

  // Singleton PeerConnection
  const PeerConnection = (function () {
    let peerConnection;
    const createPeerConnection = () => {
      const config = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      };
      peerConnection = new RTCPeerConnection(config);

      localStream?.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      peerConnection.ontrack = (event) => {
        setremoteStream(event.streams[0]);
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("icecandidate", {
            candidate: event.candidate,
            to: selectedUsers?._id || callUserId,
          });
        }
      };

      return peerConnection;
    };

    return {
      // getInstance: () => {
      //   if (!peerConnection) peerConnection = createPeerConnection();
      //   return peerConnection;
      // },
      getInstance: () => {
        if (!peerConnection) peerConnection = createPeerConnection();
        return peerConnection;
      },
      createNew: () => {
        peerConnection = createPeerConnection();
        return peerConnection;
      },
    };
  })();

  // Local stream on load
  useEffect(() => {
    const getLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setlocalStream(stream);
      } catch (err) {
        console.error("Error getting media stream", err);
      }
    };
    getLocalStream();
  }, []);

  useEffect(() => {
    if (showOverlay && localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [showOverlay, localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Offer/Answer handlers
  useEffect(() => {
    if (!socket) return;

    // const handleOffer = async ({ from, to, offer }) => {
    //   const peer = PeerConnection.getInstance();
    //   await peer.setRemoteDescription(offer);
    //   const answer = await peer.createAnswer();
    //   await peer.setLocalDescription(answer);
    //   socket.emit("answer", { from: user._id, to, answer });
    //   setShowOverlay(true);
    // };

    const handleOffer = async ({ from, to, offer }) => {
      const peer = PeerConnection.getInstance();

      if (peer.signalingState !== "stable") {
        console.warn("Peer not stable. Resetting peer connection.");
        peer.close();
        peer = PeerConnection.createNew(); // you need to add this method to recreate a new connection
      }

      try {
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("answer", { from: user._id, to, answer });
        setShowOverlay(true);
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    };

    // const handleAnswer = async ({ from, to, answer }) => {
    //   const peer = PeerConnection.getInstance();
    //   await peer.setRemoteDescription(answer);
    // };
    const handleAnswer = async ({ from, to, answer }) => {
      const peer = PeerConnection.getInstance();

      // Avoid setting remote answer if already in 'stable' state
      if (peer.signalingState !== "stable") {
        try {
          await peer.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (err) {
          console.error("Failed to set remote answer:", err);
        }
      } else {
        console.warn(
          "Peer already in stable state. Skipping setting remote answer."
        );
      }
    };

    const handleICE = async (candidate) => {
      if (candidate) {
        try {
          const peer = PeerConnection.getInstance();
          await peer.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("Error adding ICE candidate", err);
        }
      }
    };

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("icecandidate", handleICE);

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("icecandidate", handleICE);
    };
  }, [socket, localStream]);

  // 📞 Start a call only after accepted
  const startCall = () => {
    socket.emit("call-user", {
      from: user._id,
      to: selectedUsers._id,
      userInfo: {
        name: user.name,
        profilePicture: user.profilePicture,
      },
    });

    socket.on("call-accepted", async ({ to }) => {
      const peer = PeerConnection.getInstance();
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socket.emit("offer", {
        from: user._id,
        to: selectedUsers._id,
        offer: peer.localDescription,
      });

      setShowOverlay(true);
    });

    socket.on("call-rejected", ({ to }) => {
      alert("User rejected the call.");
      setShowOverlay(false);
    });
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    window.location.href = "/conversation"; // optional route redirect
  };

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
        <div className="flex flex-col text-[26px] font-bold">
          {selectedUsers?.name}
          <span className="text-[16px] font-semibold">Ready to call?</span>
        </div>
        <button
          onClick={startCall}
          className="bg-black text-white p-3 rounded-full hover:scale-110 transition"
        >
          <FaPhone size={28} />
        </button>
      </div>

      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <button
            onClick={handleCloseOverlay}
            className="absolute top-4 right-4 text-white text-3xl"
          >
            <IoMdClose />
          </button>
          <div className="flex gap-4">
            <div className="w-[700px] h-[525px] bg-black rounded-lg shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                className="w-full h-full rounded-lg"
              ></video>
            </div>
            <div className="w-[700px] h-[525px] bg-black rounded-lg shadow-lg">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full rounded-lg"
              ></video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Call;
