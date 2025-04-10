// // import React, { useEffect } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { setMessages } from "../ReduxStore/ChatSlice.js";
// // function useGetRTMmessage() {
// //   const { socket } = useSelector((store) => store.socketio);
// //   const { messages } = useSelector((store) => store.chat);
// //   const dispatch = useDispatch();
// //   useEffect(() => {
// //     socket?.on("newMessage", (newmsg) => {
// //       dispatch(setMessages([...messages, newmsg]));
// //     });
// //     return () => {
// //       socket?.off("newMessage");
// //     };
// //   }, [socket, dispatch]);
// // }

// // export default useGetRTMmessage;

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setMessages } from "../ReduxStore/ChatSlice.js";
// function useGetRTMmessage() {
//   const { socket } = useSelector((store) => store.socketio);
//   const dispatch = useDispatch();
//   const messagesRef = React.useRef([]);

//   const messages = useSelector((store) => store.chat.messages);
//   useEffect(() => {
//     messagesRef.current = messages;
//   }, [messages]);

//   useEffect(() => {
//     const handleNewMessage = (newmsg) => {
//       dispatch(setMessages([...messagesRef.current, newmsg]));
//     };

//     socket?.on("newMessage", handleNewMessage);
//     return () => {
//       socket?.off("newMessage", handleNewMessage);
//     };
//   }, [socket, dispatch]);
// }
// export default useGetRTMmessage;

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setMessages } from "../ReduxStore/ChatSlice.js";

// function useGetRTMmessage() {
//   const { socket } = useSelector((store) => store.socketio);
//   const dispatch = useDispatch();
//   const messages = useSelector((store) => store.chat.messages);
//   const messagesRef = React.useRef([]);

//   useEffect(() => {
//     messagesRef.current = messages;
//   }, [messages]);

//   useEffect(() => {
//     const handleNewMessage = (newmsg) => {
//       dispatch(setMessages([...messagesRef.current, newmsg]));

//       // Acknowledge delivery
//       socket.emit("message-delivered", newmsg._id);
//     };

//     const handleStatusUpdate = (updatedMsg) => {
//       const updatedMessages = messagesRef.current.map((msg) =>
//         msg._id === updatedMsg._id ? updatedMsg : msg
//       );
//       dispatch(setMessages(updatedMessages));
//     };

//     socket?.on("newMessage", handleNewMessage);
//     socket?.on("message-status-updated", handleStatusUpdate);

//     return () => {
//       socket?.off("newMessage", handleNewMessage);
//       socket?.off("message-status-updated", handleStatusUpdate);
//     };
//   }, [socket, dispatch]);
// }

// export default useGetRTMmessage;

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../ReduxStore/ChatSlice.js";
import {useSocket } from "../SocketContext.js";
function useGetRTMmessage() {
  const socket = useSocket();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const messages = useSelector((store) => store.chat.messages);
  const messagesRef = useRef([]);

  useEffect(() => {
    messagesRef.current = messages; 
  }, [messages]);

  useEffect(() => {
    if (!socket || !user) return;

    const handleNewMessage = (newmsg) => {
      dispatch(setMessages([...messagesRef.current, newmsg]));
      // ✅ Emit delivered only if current user is the receiver and status is 'sent'
      if (newmsg.receiverId === user._id && newmsg.status === "sent") {
        socket.emit("message-delivered", newmsg._id);
      }
    };

    const handleStatusUpdate = (updatedMsg) => {
      const updatedMessages = messagesRef.current.map((msg) =>
        msg._id === updatedMsg._id ? updatedMsg : msg
      );
      dispatch(setMessages(updatedMessages));
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("message-status-updated", handleStatusUpdate);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("message-status-updated", handleStatusUpdate);
    };
  }, [socket, dispatch, user]);
}

export default useGetRTMmessage;

// import React, { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setMessages } from "../ReduxStore/ChatSlice.js";
// import { getSocket } from "../socket"; // ⬅️ NEW

// function useGetRTMmessage() {
//   const dispatch = useDispatch();
//   const messages = useSelector((store) => store.chat.messages);
//   const messagesRef = useRef([]);

//   useEffect(() => {
//     messagesRef.current = messages;
//   }, [messages]);

//   useEffect(() => {
//     const socket = getSocket();
//     if (!socket) return;

//     const handleNewMessage = (newmsg) => {
//       dispatch(setMessages([...messagesRef.current, newmsg]));
//       socket.emit("message-delivered", newmsg._id);
//     };

//     const handleStatusUpdate = (updatedMsg) => {
//       const updatedMessages = messagesRef.current.map((msg) =>
//         msg._id === updatedMsg._id ? updatedMsg : msg
//       );
//       dispatch(setMessages(updatedMessages));
//     };

//     socket.on("newMessage", handleNewMessage);
//     socket.on("message-status-updated", handleStatusUpdate);

//     return () => {
//       socket.off("newMessage", handleNewMessage);
//       socket.off("message-status-updated", handleStatusUpdate);
//     };
//   }, [dispatch]);
// }

// export default useGetRTMmessage;

