import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import SignUp from "./components/SignUp.jsx";
import Profile from "./components/Profile.jsx";
import SignIn from "./components/SignIn.jsx";
import LeftSideBar from "./components/LeftSideBar.jsx";
import Home from "./components/Home.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import EditProfile from "./components/EditProfile.jsx";
import Conversation from "./components/Conversation.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setSocket } from "./ReduxStore/SocketSlice.js";
import { setOnlineUsers } from "./ReduxStore/ChatSlice.js";
import { setLikeNotification } from "./ReduxStore/RealTimeNotificationSlice.js";
import io from "socket.io-client";
function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  useEffect(() => {
    if (user) {
      const SocketIo = io("http://localhost:7464", {
        query: {
          userId: user._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(SocketIo));
      SocketIo.on("OnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });
      SocketIo.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      SocketIo.on("follow", (notification) => {
        dispatch(setLikeNotification(notification));
      });
      SocketIo.on("unfollow", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        SocketIo.close();
        dispatch(setSocket(null));
      };
    } else {
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return (
    <BrowserRouter>
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
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
