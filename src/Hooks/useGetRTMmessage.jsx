import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../ReduxStore/ChatSlice.js";
import { useSocket } from "../SocketContext.js";
function useGetRTMmessage() {
  const socket = useSocket();
  const { user,selectedUsers } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const messages = useSelector((store) => store.chat.messages);
  const messagesRef = useRef([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!socket || !user) return;
  
    const handleNewMessage = (newmsg) => {
      if (
        (newmsg.senderId === user._id && newmsg.receiverId === selectedUsers._id) ||
        (newmsg.senderId === selectedUsers._id && newmsg.receiverId === user._id)
      ) {
        dispatch(setMessages([...messagesRef.current, newmsg]));
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
  }, [socket, dispatch, user, selectedUsers]);  
}

export default useGetRTMmessage;
