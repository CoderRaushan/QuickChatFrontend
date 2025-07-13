import { SocketContext } from "./SocketContext.js";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setOnlineUsers } from "./ReduxStore/ChatSlice.js";
import { setLikeNotification } from "./ReduxStore/RealTimeNotificationSlice.js";
import { setAuthUser } from "./ReduxStore/authSlice.js";
import NotificationSound from "../public/iphone_message_tone.mp3";
import { useDispatch } from "react-redux";
const SocketProvider = (props) => {
  const children = props.children;
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [socket, setSocket] = useState(null);
  const playNotificationSound = () => {
    const audio = new Audio(NotificationSound);
    audio.play().catch((err) => console.log("Audio play error:", err));
  };
  const MainUri = import.meta.env.VITE_MainUri;
  useEffect(() => {
    if (user) {
      const SocketIo = io(`${MainUri}`, {
        query: {
          userId: user._id,
        },
        transports: ["websocket"],
      });
      setSocket(SocketIo);
      SocketIo.on("OnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });
      SocketIo.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
        if (["like", "follow", "comment"].includes(notification.type)) {
          playNotificationSound();
        }
      });
      return () => {
        SocketIo.close();
        setSocket(null);
      };
    } else {
      setSocket(null);
    }
  }, [user, dispatch]);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
export default SocketProvider;
