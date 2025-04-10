import { SocketContext } from "./SocketContext.js";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setOnlineUsers } from "./ReduxStore/ChatSlice.js";
import { setLikeNotification } from "./ReduxStore/RealTimeNotificationSlice.js";
import { setAuthUser } from "./ReduxStore/authSlice.js";
import { useDispatch } from "react-redux";
const SocketProvider = ({ children }) => {
   const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (user) {
      const SocketIo = io("http://localhost:7464", {
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
      });

      SocketIo.on("follow", (notification) => {//userDetails
        console.log("follow no");
        console.log("follow userdetails",notification.author)
        dispatch(setAuthUser(notification.author));
        dispatch(setLikeNotification(notification));
      });
      SocketIo.on("unfollow", (notification) => {
        console.log("unfollow no");
        dispatch(setAuthUser(notification.author));
        console.log("unfollow userdetails",notification.author)
        dispatch(setLikeNotification(notification));
      });
      return () => {
        SocketIo.close();
        setSocket(null);
      };
    } else {
      setSocket(null);
    }
  }, [user, dispatch]);
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
export default SocketProvider;
