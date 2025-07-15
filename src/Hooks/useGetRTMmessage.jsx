import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotificationSound from "../../public/iphone_message_tone.mp3";
import { setTypingUser } from "../ReduxStore/ChatSlice";
import {
  setChatNotifications,
  setConversationMap,
  setMessages,
} from "../ReduxStore/ChatSlice.js";
import { useSocket } from "../SocketContext.js";

function useGetRTMmessage() {
  const socket = useSocket();
  const { user, selectedUsers } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const messages = useSelector((store) => store.chat.messages);
  const messagesRef = useRef([]);
  const [typingUser, setTypingUser] = useState(null);
  const chatNotifications = useSelector(
    (store) => store.chat.chatNotifications
  );
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  

  const playNotificationSound = () => {
    const audio = new Audio(NotificationSound);
    audio.play().catch((err) => console.log("Audio play error:", err));
  };

  useEffect(() => {
    if (!socket || !user) return;
    const handleNewMessage = (newmsg) => {
      // console.log("Hook called");
      // if (
      //   (newmsg.senderId === user._id &&
      //     newmsg.receiverId === selectedUsers?._id) ||
      //   (newmsg.senderId === selectedUsers?._id &&
      //     newmsg.receiverId === user._id)
      // ) {
      //   console.log("New message received:", newmsg);
      // }
      dispatch(setMessages([...messagesRef.current, newmsg]));
      if (newmsg.senderId !== selectedUsers?._id) {
        const updatedNotifications = { ...chatNotifications,[newmsg.senderId]: newmsg };
        // updatedNotifications[newmsg.senderId] = newmsg.messages;
        dispatch(setChatNotifications(updatedNotifications));
        playNotificationSound();
      }
    };

    const handleStatusUpdate = (updatedMsg) => {
      const updatedMessages = messagesRef.current.map((msg) =>
        msg._id === updatedMsg._id ? updatedMsg : msg
      );
      dispatch(setMessages(updatedMessages));
    };

    const handleMessageConfirmed = (confirmedMessage) => {
      const updated = messagesRef.current.map((msg) =>
        msg._id === confirmedMessage.tempId ? confirmedMessage : msg
      );
      dispatch(setMessages(updated));
    };

    const handleTyping = ({ from, username }) => {
      if (selectedUsers && from === selectedUsers._id) {
        setTypingUser(username);
      }
    };

    const handleStopTyping = ({ from }) => {
      if (selectedUsers && from === selectedUsers._id) {
        setTypingUser(null);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("message-status-updated", handleStatusUpdate);
    socket.on("message-confirmed", handleMessageConfirmed);
    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("message-status-updated", handleStatusUpdate);
      socket.off("message-confirmed", handleMessageConfirmed);
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, [socket, dispatch, user, selectedUsers]);

  return typingUser; // ✅ RETURN typingUser here
}

export default useGetRTMmessage;
