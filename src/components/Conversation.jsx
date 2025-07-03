import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setselectedUsers } from "../ReduxStore/authSlice.js";
import { Button } from "@/components/ui/button";
import { MessageCircleCode, ArrowLeft } from "lucide-react";
import Messages from "./Messages.jsx";
import {
  setConversationMap,
  setMessages,
  setchatHistory,
} from "../ReduxStore/ChatSlice.js";
import { useSocket } from "../SocketContext.js";
import { FiPaperclip } from "react-icons/fi";
import FileUpload from "./FileUpload.jsx";
import axios from "axios";
function Conversation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, selectedUsers } = useSelector((store) => store.auth);
  const { messages, onlineUsers, chatHistory, conversationMap } = useSelector(
    (store) => store.chat
  );
  const [TextMsg, setTextMsg] = useState("");
  const socket = useSocket();
  const seenMessageIds = useRef(new Set());
  const inputfileRef = useRef(null);
  const [fileData, setFileData] = useState(null);
  const handleIconClick = () => {
    inputfileRef.current.click();
  };
  const HandleFIleclick = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileData(file);
    }
  };
  useEffect(() => {
    if (!socket || !socket.connected || !selectedUsers) return;
    const seenMessages = messages.filter(
      (msg) =>
        msg.receiverId === user._id &&
        msg.senderId === selectedUsers._id &&
        msg.status !== "seen" &&
        !seenMessageIds.current.has(msg._id)
    );
    if (seenMessages.length > 0) {
      seenMessages.forEach((msg) => {
        socket.emit("message-seen", msg._id);
      });
    }
  }, [messages, user?._id, selectedUsers, socket]);

  useEffect(() => {
    if (!user) navigate("/signin");
  }, [user, navigate]);

  useEffect(() => {
    seenMessageIds.current.clear();
  }, [selectedUsers]);
  // useEffect(() => {
  //   dispatch(setCurrentChatUser(selectedUsers));
  // }, [selectedUsers]);
  useEffect(() => {
    const fetchConversations = async () => {
      if (user) {
        const followingSet = new Set(user.following.map((f) => String(f._id)));
        const mutuals = user.followers.filter((f) =>
          followingSet.has(String(f._id))
        );

        dispatch(setchatHistory(mutuals));
        dispatch(setMessages([]));
        const mutualIds = mutuals.map((m) => m._id);
        const MainUri = import.meta.env.VITE_MainUri;

        const res = await axios.post(
          `${MainUri}/user/message/conversations/bulk-start`,
          {
            userIds: mutualIds,
          },
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setConversationMap(res.data.conversationMap)); // Store in Redux or Context
        }
      }
    };
    fetchConversations();
  }, [user]);

  useEffect(() => {
    return () => dispatch(setselectedUsers(null));
  }, [dispatch]);

  const sendMessageHandler = async (ReceiverId) => {
    if (!TextMsg.trim()) return;
    const tempId = `temp-${uuidv4()}`;
    const optimisticMessage = {
      _id: tempId,
      senderId: user._id,
      receiverId: ReceiverId,
      messages: TextMsg,
      status: "sent",
      createdAt: new Date().toISOString(),
    };
    dispatch(setMessages([...messages, optimisticMessage]));
    setTextMsg("");
    socket.emit("send-message", {
      conversationId: selectedUsers?.conversationId,
      receiverId: ReceiverId,
      text: TextMsg,
      tempId,
    });
  };
  const typingTimeoutRef = useRef(null);

  const handleTyping = () => {
    socket.emit("typing", {
      to: selectedUsers._id,
      from: user._id,
      username: user.username,
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { to: selectedUsers._id });
    }, 500);
  };
  // console.log("selectedUsers after",selectedUsers);
  return (
    <div className="flex flex-col md:flex-row h-screen ml-[70px] sm:ml-[100px] md:ml-[16%]">
      {/* Message Sidebar */}
      <section
        className={`${
          selectedUsers ? "hidden md:block" : "block"
        } md:w-1/4 border-r border-gray-300 px-2 py-4 overflow-y-auto`}
      >
        <h1 className="font-bold text-lg mb-4">{user?.username}</h1>
        <h2 className="text-md font-semibold mb-2">Messages</h2>
        {chatHistory?.map((mutualuser) => {
          const isOnline = onlineUsers?.includes(mutualuser?._id);
          return (
            <div
              key={mutualuser?._id}
              className="flex gap-3 items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg"
              onClick={async () => {
                if (selectedUsers?._id!==mutualuser?._id) {
                  const conversationId = await conversationMap[mutualuser?._id];
                  dispatch(setselectedUsers({ ...mutualuser, conversationId }));
                }
              }}
            >
              <Avatar>
                <AvatarImage src={mutualuser?.profilePicture} />
                <AvatarFallback>{mutualuser?.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {mutualuser?.username}
                </span>
                <span
                  className={`text-xs font-bold ${
                    isOnline ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          );
        })}
      </section>
      {/* Chat Section */}
      {selectedUsers ? (
        <section className="flex-1 flex flex-col justify-between">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-300 sticky top-0 bg-white z-10">
            <button
              className="md:hidden"
              onClick={() => dispatch(setselectedUsers(null))}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Avatar>
              <AvatarImage src={selectedUsers?.profilePicture} />
              <AvatarFallback>{selectedUsers?.username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col font-medium">
              {selectedUsers?.username}
            </div>
          </div>
          <Messages selectedUsers={selectedUsers} />
          <div className="flex items-center p-4 border-t border-gray-300 relative w-full">
            <input
              value={TextMsg}
              onKeyDown={(e) => {
                if (e.key === "Enter" && TextMsg.trim()) {
                  sendMessageHandler(selectedUsers?._id);
                }
              }}
              onChange={(e) => {
                setTextMsg(e.target.value);
                handleTyping();
              }}
              type="text"
              className="flex-1 mr-2 bg-gray-100 p-2 rounded-md"
              placeholder="Type a message..."
            />
            <Button onClick={() => sendMessageHandler(selectedUsers?._id)}>
              Send
            </Button>
            <input
              type="file"
              ref={inputfileRef}
              onChange={HandleFIleclick}
              className="hidden"
            />
            <FiPaperclip
              className="absolute right-[100px] top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer size-5"
              onClick={handleIconClick}
            />
          </div>
          {fileData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <FileUpload fileData={fileData} setFileData={setFileData} />
            </div>
          )}
        </section>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center">
          <MessageCircleCode className="w-20 h-20 text-gray-400 mb-4" />
          <h1 className="font-bold text-xl">Your Messages</h1>
          <p className="text-sm text-gray-500">
            Send a message to start a chat
          </p>
        </div>
      )}
    </div>
  );
}

export default Conversation;
