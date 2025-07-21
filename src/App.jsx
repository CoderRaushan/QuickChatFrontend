// import "./App.css";
// import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
// import SignUp from "./components/SignUp.jsx";
// import Profile from "./components/Profile.jsx";
// import SignIn from "./components/SignIn.jsx";
// import LeftSideBar from "./components/LeftSideBar.jsx";
// import Home from "./components/Home.jsx";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import EditProfile from "./components/EditProfile.jsx";
// import Conversation from "./components/Conversation.jsx";
// import Explore from "./components/Explore.jsx";
// import useGetRTMmessage from "./Hooks/useGetRTMmessage.jsx";
// import { useSelector } from "react-redux";
// import { useSocket } from "./SocketContext.js";
// import StoryPage from "./components/story/StoryPage.jsx";
// import Call from "./components/Call.jsx";
// import IncomingCallPopup from "./components/IncomingCallPopup.jsx";
// import { useState } from "react";
// function App() {
//   const { user } = useSelector((store) => store.auth);
//   const socket = useSocket();
//   const [incomingCall, setIncomingCall] = useState(null);
//   const navigate = useNavigate();
//   useEffect(() => {
//     if (!socket || !user) return;

//     socket.on("incoming-call", ({ from, userInfo }) => {
//       setIncomingCall({ from, userInfo });
//     });

//     return () => {
//       socket.off("incoming-call");
//     };
//   }, [socket, user]);

//   const acceptCall = () => {
//     if (incomingCall) {
//       socket.emit("call-accepted", {
//         from: incomingCall.from,
//         to: user._id,
//       });
//       navigate(`/call/${incomingCall.from}`);
//       setIncomingCall(null);
//     }
//   };

//   const rejectCall = () => {
//     if (incomingCall) {
//       socket.emit("call-rejected", {
//         from: incomingCall.from,
//         to: user._id,
//       });
//       setIncomingCall(null);
//     }
//   };

//   useGetRTMmessage();
//   return (
//     <BrowserRouter>
//       <div style={{ display: "flex" }}>
//         <LeftSideBar />
//         <div style={{ flex: 1 }}>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/signup" element={<SignUp />} />
//             <Route path="/signin" element={<SignIn />} />
//             <Route path="/profile/:id" element={<Profile />} />
//             <Route path="/account/edit" element={<EditProfile />} />
//             <Route path="/conversation" element={<Conversation />} />
//             <Route path="/explore" element={<Explore />} />
//             <Route path="/story/:id" element={<StoryPage />} />
//             <Route path="/call/:id" element={<Call />} />
//           </Routes>
//         </div>
//       </div>
//       {/* Incoming Call UI */}
//       {incomingCall && (
//         <IncomingCallPopup
//           caller={incomingCall.userInfo}
//           onAccept={acceptCall}
//           onReject={rejectCall}
//         />
//       )}
//     </BrowserRouter>
//   );
// }

// export default App;

//2nd
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import SignUp from "./components/SignUp.jsx";
import Profile from "./components/Profile.jsx";
import SignIn from "./components/SignIn.jsx";
import LeftSideBar from "./components/LeftSideBar.jsx";
import Home from "./components/Home.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import EditProfile from "./components/EditProfile.jsx";
import Conversation from "./components/Conversation.jsx";
import Explore from "./components/Explore.jsx";
import useGetRTMmessage from "./Hooks/useGetRTMmessage.jsx";
import { useSelector } from "react-redux";
import { useSocket } from "./SocketContext.js";
import StoryPage from "./components/story/StoryPage.jsx";
import Call from "./components/Call.jsx";
import IncomingCallPopup from "./components/IncomingCallPopup.jsx";
import { useState, useEffect } from "react";

function App() {
  const { user } = useSelector((store) => store.auth);
  const socket = useSocket();
  const [incomingCall, setIncomingCall] = useState(null);
  const navigate = useNavigate(); // ✅ Works now that App is inside <BrowserRouter>

  useEffect(() => {
    if (!socket || !user) return;

    socket.on("incoming-call", ({ from, userInfo }) => {
      setIncomingCall({ from, userInfo });
    });

    return () => {
      socket.off("incoming-call");
    };
  }, [socket, user]);

  const acceptCall = () => {
    if (incomingCall) {
      socket.emit("call-accepted", {
        from: incomingCall.from,
        to: user._id,
      });
      navigate(`/call/${incomingCall.from}`);
      setIncomingCall(null);
    }
  };

  const rejectCall = () => {
    if (incomingCall) {
      socket.emit("call-rejected", {
        from: incomingCall.from,
        to: user._id,
      });
      setIncomingCall(null);
    }
  };

  useGetRTMmessage();

  return (
    <div style={{ display: "flex" }}>
      <LeftSideBar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/account/edit" element={<EditProfile />} />
          <Route path="/conversation" element={<Conversation />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/story/:id" element={<StoryPage />} />
          <Route path="/call/:id" element={<Call />} />
        </Routes>
      </div>

      {/* Incoming Call UI */}
      {incomingCall && (
        <IncomingCallPopup
          caller={incomingCall.userInfo}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}
    </div>
  );
}

export default App;

// // App.js
// import "./App.css";
// import { Routes, Route, BrowserRouter } from "react-router-dom";
// import SignUp from "./components/SignUp.jsx";
// import Profile from "./components/Profile.jsx";
// import SignIn from "./components/SignIn.jsx";
// import LeftSideBar from "./components/LeftSideBar.jsx";
// import Home from "./components/Home.jsx";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import EditProfile from "./components/EditProfile.jsx";
// import Conversation from "./components/Conversation.jsx";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { setOnlineUsers } from "./ReduxStore/ChatSlice.js";
// import { setLikeNotification } from "./ReduxStore/RealTimeNotificationSlice.js";
// import { setAuthUser } from "./ReduxStore/authSlice.js";
// import { initSocket, disconnectSocket } from "./socket"; // ⬅️ NEW

// function App() {
//   const dispatch = useDispatch();
//   const { user } = useSelector((store) => store.auth);

//   useEffect(() => {
//     if (user) {
//       const socket = initSocket(user._id);

//       socket.on("OnlineUsers", (users) => {
//         dispatch(setOnlineUsers(users));
//       });

//       socket.on("notification", (notification) => {
//         dispatch(setLikeNotification(notification));
//       });

//       socket.on("follow", (notification) => {
//         console.log("follow userdetails", notification.author);
//         dispatch(setAuthUser(notification.author));
//         dispatch(setLikeNotification(notification));
//       });

//       // socket.on("unfollow", (notification) => {
//       //   console.log("unfollow userdetails", notification.author);
//       //   dispatch(setAuthUser(notification.author));
//       //   dispatch(setLikeNotification(notification));
//       // });

//       return () => {
//         disconnectSocket();
//       };
//     }
//   }, [user, dispatch]);

//   return (
// <BrowserRouter>
//   <div style={{ display: "flex" }}>
//     <LeftSideBar />
//     <div style={{ flex: 1 }}>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/signin" element={<SignIn />} />
//         <Route path="/profile/:id" element={<Profile />} />
//         <Route path="/account/edit" element={<EditProfile />} />
//         <Route path="/conversation" element={<Conversation />} />
//       </Routes>
//     </div>
//   </div>
// </BrowserRouter>
//   );
// }

// export default App;
