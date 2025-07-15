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
  setChatNotifications,
  setConversationMap,
  setMessages,
  setchatHistory,
} from "../ReduxStore/ChatSlice.js";
import { useSocket } from "../SocketContext.js";
import { FiPaperclip } from "react-icons/fi";
import FileUpload from "./FileUpload.jsx";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
function Conversation() {
  const hasFetched = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, selectedUsers } = useSelector((store) => store.auth);
  const {
    messages,
    onlineUsers,
    chatHistory,
    conversationMap,
    chatNotifications,
  } = useSelector((store) => store.chat);
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
        try {
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
        } catch (err) {
          console.log(err);
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
      {/* <section
        className={`${
          selectedUsers ? "hidden md:block" : "block"
        } md:w-1/4 border-r border-gray-300 px-2 py-4 overflow-y-auto`}
      >
        <h1 className="font-bold text-lg mb-4">{user?.username}</h1>
        <h2 className="text-md font-semibold mb-2">Messages</h2>

        {chatHistory
          ?.slice()
          .sort((a, b) => {
            const idA = conversationMap[a?._id];
            const idB = conversationMap[b?._id];

            const msgA = messages?.filter((msg) => msg.conversationId === idA);
            const msgB = messages?.filter((msg) => msg.conversationId === idB);

            const latestA = msgA?.length
              ? new Date(
                  msgA.reduce((latest, curr) =>
                    new Date(curr.createdAt) > new Date(latest.createdAt)
                      ? curr
                      : latest
                  ).createdAt
                )
              : new Date(0); // if no messages

            const latestB = msgB?.length
              ? new Date(
                  msgB.reduce((latest, curr) =>
                    new Date(curr.createdAt) > new Date(latest.createdAt)
                      ? curr
                      : latest
                  ).createdAt
                )
              : new Date(0);

            return latestB - latestA; // sort in descending order
          })
          .map((mutualuser) => 
          {
            let latestMessage;
            const conversationId = conversationMap[mutualuser?._id];
            const conversationMessages = messages?.filter(
              (msg) => msg?.conversationId === conversationId
            );

            if (conversationMessages && conversationMessages.length > 0) {
              latestMessage = conversationMessages.reduce((latest, current) =>
                new Date(current.createdAt) > new Date(latest.createdAt)
                  ? current
                  : latest
              );
            }

            let truncatedMessage;
            if (latestMessage?.messages) {
              const words = latestMessage.messages.split(" ");
              truncatedMessage = {
                ...latestMessage,
                messages:
                  words.slice(0, 5).join(" ") +
                  (words.length > 5 ? " ..." : ""),
              };
              localStorage.setItem(
                `conversationMsg-${mutualuser?._id}`,
                JSON.stringify(truncatedMessage)
              );
            }

            const storedMsg = JSON.parse(
              localStorage.getItem(`conversationMsg-${mutualuser?._id}`)
            );
            const isOnline = onlineUsers?.includes(mutualuser?._id);

            return (
              <div
                key={mutualuser?._id}
                className="flex gap-3 items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg"
                onClick={async () => {
                  if (selectedUsers?._id !== mutualuser?._id) {
                    const conversationId = await conversationMap[
                      mutualuser?._id
                    ];
                    dispatch(
                      setselectedUsers({ ...mutualuser, conversationId })
                    );
                  }
                }}
              >
                <div className="relative w-fit">
                  <Avatar>
                    <AvatarImage src={mutualuser?.profilePicture} />
                    <AvatarFallback>{mutualuser?.username[0]}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute top-0 left-[-4px] w-3 h-3 rounded-full border-2 border-white ${
                      isOnline ? "bg-green-500" : "bg-red-400"
                    }`}
                  ></span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {mutualuser?.username}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {storedMsg?.senderId === user?._id ? "You: " : ""}
                    {storedMsg?.messages || (isOnline ? "Online" : "Offline")}
                  </span>
                </div>
              </div>
            );
          })}
      </section> */}
      {/* <section
        className={`${
          selectedUsers ? "hidden md:block" : "block"
        } md:w-1/4 border-r border-gray-300 px-2 py-4 overflow-y-auto`}
      >
        <h1 className="font-bold text-lg mb-4">{user?.username}</h1>
        <h2 className="text-md font-semibold mb-2">Messages</h2>

        {chatHistory
          ?.slice()
          // .sort((a, b) => {
          //   const idA = conversationMap[a?._id];
          //   const idB = conversationMap[b?._id];

          //   const msgA = messages?.filter((msg) => msg.conversationId === idA);
          //   const msgB = messages?.filter((msg) => msg.conversationId === idB);

          //   const latestA = msgA?.length
          //     ? new Date(
          //         msgA.reduce((latest, curr) =>
          //           new Date(curr.createdAt) > new Date(latest.createdAt)
          //             ? curr
          //             : latest
          //         ).createdAt
          //       )
          //     : new Date(0);

          //   const latestB = msgB?.length
          //     ? new Date(
          //         msgB.reduce((latest, curr) =>
          //           new Date(curr.createdAt) > new Date(latest.createdAt)
          //             ? curr
          //             : latest
          //         ).createdAt
          //       )
          //     : new Date(0);

          //   return latestB - latestA;
          // })
          .sort((a, b) => {
            const idA = conversationMap[a?._id];
            const idB = conversationMap[b?._id];

            // Get latest timestamp either from messages or notifications
            const msgA = messages?.filter((msg) => msg.conversationId === idA);
            const msgB = messages?.filter((msg) => msg.conversationId === idB);

            const latestMsgA =
              chatNotifications[a._id] ||
              (msgA?.length
                ? msgA.reduce((latest, curr) =>
                    new Date(curr.createdAt) > new Date(latest.createdAt)
                      ? curr
                      : latest
                  )
                : null);

            const latestMsgB =
              chatNotifications[b._id] ||
              (msgB?.length
                ? msgB.reduce((latest, curr) =>
                    new Date(curr.createdAt) > new Date(latest.createdAt)
                      ? curr
                      : latest
                  )
                : null);

            const timeA = latestMsgA?.createdAt
              ? new Date(latestMsgA.createdAt)
              : new Date(0);
            const timeB = latestMsgB?.createdAt
              ? new Date(latestMsgB.createdAt)
              : new Date(0);

            return timeB - timeA;
          })
          .map((mutualuser) => {
            const conversationId = conversationMap[mutualuser?._id];
            const conversationMessages = messages?.filter(
              (msg) => msg?.conversationId === conversationId
            );

            let latestMessage;
            if (conversationMessages && conversationMessages.length > 0) {
              latestMessage = conversationMessages.reduce((latest, current) =>
                new Date(current.createdAt) > new Date(latest.createdAt)
                  ? current
                  : latest
              );
            }

            // check if this user has a new message in notification
            const notificationMsg = chatNotifications?.[mutualuser._id];

            // Decide which message to show
            const showMessage = notificationMsg || latestMessage;

            let truncatedMessage = "";
            if (showMessage?.messages) {
              const words = showMessage.messages.split(" ");
              truncatedMessage =
                words.slice(0, 5).join(" ") + (words.length > 5 ? " ..." : "");
            }

            const isUnread = !!notificationMsg;
            const isOnline = onlineUsers?.includes(mutualuser?._id);

            return (
              <div
                key={mutualuser?._id}
                className="flex gap-2 items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg"
                onClick={async () => {
                  if (selectedUsers?._id !== mutualuser?._id) {
                    const conversationId = await conversationMap[
                      mutualuser?._id
                    ];
                    dispatch(
                      setselectedUsers({ ...mutualuser, conversationId })
                    );

                    // Clear unread notification
                    const updatedNotifications = { ...chatNotifications };
                    delete updatedNotifications[mutualuser._id];
                    dispatch(setChatNotifications(updatedNotifications));
                  }
                }}
              >
                <div className="relative w-fit">
                  <Avatar>
                    <AvatarImage src={mutualuser?.profilePicture} />
                    <AvatarFallback>{mutualuser?.username[0]}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute top-0 left-[-4px] w-3 h-3 rounded-full border-2 border-white ${
                      isOnline ? "bg-green-500" : "bg-red-400"
                    }`}
                  ></span>
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-sm ${
                      isUnread ? "font-bold" : "font-medium"
                    }`}
                  >
                    {mutualuser?.username}
                  </span>
                  <span
                    className={`text-xs truncate max-w-[180px] ${
                      isUnread ? "text-black font-bold" : "text-gray-500"
                    }`}
                  >
                    {showMessage?.senderId === user?._id ? "You: " : ""}
                    {notificationMsg ||
                      truncatedMessage ||
                      (isOnline ? "Online" : "Offline")}
                  </span>
                </div>
                {notificationMsg && (
                  <span className="ml-auto h-2 w-2 bg-blue-500 rounded-full"></span>
                )}
              </div>
            );
          })}
      </section> */}
      {/* <section
        className={`${
          selectedUsers ? "hidden md:block" : "block"
        } md:w-1/4 border-r border-gray-300 px-2 py-4 overflow-y-auto`}
      >
        <h1 className="font-bold text-lg mb-4">{user?.username}</h1>
        <h2 className="text-md font-semibold mb-2">Messages</h2>

        {chatHistory
          ?.slice()
          .sort((a, b) => {
            const idA = conversationMap[a?._id];
            const idB = conversationMap[b?._id];

            const msgA = messages?.filter((msg) => msg.conversationId === idA);
            const msgB = messages?.filter((msg) => msg.conversationId === idB);

            const latestMsgA =
              chatNotifications[a._id] ||
              (msgA?.length
                ? msgA.reduce((latest, curr) =>
                    new Date(curr.createdAt) > new Date(latest.createdAt)
                      ? curr
                      : latest
                  )
                : null);

            const latestMsgB =
              chatNotifications[b._id] ||
              (msgB?.length
                ? msgB.reduce((latest, curr) =>
                    new Date(curr.createdAt) > new Date(latest.createdAt)
                      ? curr
                      : latest
                  )
                : null);

            const timeA = latestMsgA?.createdAt
              ? new Date(latestMsgA.createdAt)
              : new Date(0);
            const timeB = latestMsgB?.createdAt
              ? new Date(latestMsgB.createdAt)
              : new Date(0);

            return timeB - timeA;
          })
          .map((mutualuser) => {
            const conversationId = conversationMap[mutualuser?._id];
            const conversationMessages = messages?.filter(
              (msg) => msg?.conversationId === conversationId
            );

            let latestMessage;
            if (conversationMessages && conversationMessages.length > 0) {
              latestMessage = conversationMessages.reduce((latest, current) =>
                new Date(current.createdAt) > new Date(latest.createdAt)
                  ? current
                  : latest
              );
            }

            const notificationMsg = chatNotifications?.[mutualuser._id];
            const showMessage = notificationMsg || latestMessage;

            let truncatedMessage = "";
            if (showMessage?.messages) {
              const words = showMessage.messages.split(" ");
              truncatedMessage =
                words.slice(0, 5).join(" ") + (words.length > 5 ? " ..." : "");
            }

            const isUnread = !!notificationMsg;
            const isOnline = onlineUsers?.includes(mutualuser?._id);

            return (
              <div
                key={mutualuser?._id}
                className="flex gap-2 items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg"
                onClick={async () => {
                  if (selectedUsers?._id !== mutualuser?._id) {
                    const conversationId = await conversationMap[
                      mutualuser._id
                    ];
                    dispatch(
                      setselectedUsers({ ...mutualuser, conversationId })
                    );

                    // Clear unread notification
                    const updatedNotifications = { ...chatNotifications };
                    delete updatedNotifications[mutualuser._id];
                    dispatch(setChatNotifications(updatedNotifications));
                  }
                }}
              >
                <div className="relative w-fit">
                  <Avatar>
                    <AvatarImage src={mutualuser?.profilePicture} />
                    <AvatarFallback>{mutualuser?.username[0]}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute top-0 left-[-4px] w-3 h-3 rounded-full border-2 border-white ${
                      isOnline ? "bg-green-500" : "bg-red-400"
                    }`}
                  ></span>
                </div>

                <div className="flex flex-col flex-1">
                  <span
                    className={`text-sm ${
                      isUnread ? "font-bold" : "font-medium"
                    }`}
                  >
                    {mutualuser?.username}
                  </span>
                  <span
                    className={`text-xs truncate max-w-[180px] ${
                      isUnread ? "text-black font-bold" : "text-gray-500"
                    }`}
                  >
                    {showMessage?.senderId === user?._id ? "You: " : ""}
                    {truncatedMessage || (isOnline ? "Online" : "Offline")}
                  </span>
                </div>

                
                {isUnread && (
                  <span className="ml-auto h-2 w-2 bg-blue-500 rounded-full"></span>
                )}
              </div>
            );
          })}
      </section> */}
      <section
        className={`${
          selectedUsers ? "hidden md:block" : "block"
        } md:w-1/4 border-r border-gray-300 px-2 py-4 overflow-y-auto`}
      >
        <h1 className="font-bold text-lg mb-4">{user?.username}</h1>
        <h2 className="text-md font-semibold mb-2">Messages</h2>

        {chatHistory
          ?.slice()
          .sort((a, b) => {
            const idA = conversationMap[a?._id];
            const idB = conversationMap[b?._id];

            const msgA = messages?.filter((msg) => msg.conversationId === idA);
            const msgB = messages?.filter((msg) => msg.conversationId === idB);

            const latestMsgA =
              chatNotifications[a._id] ||
              (msgA?.length
                ? msgA.reduce((latest, curr) =>
                    new Date(curr.createdAt) > new Date(latest.createdAt)
                      ? curr
                      : latest
                  )
                : null);

            const latestMsgB =
              chatNotifications[b._id] ||
              (msgB?.length
                ? msgB.reduce((latest, curr) =>
                    new Date(curr.createdAt) > new Date(latest.createdAt)
                      ? curr
                      : latest
                  )
                : null);

            const timeA = latestMsgA?.createdAt
              ? new Date(latestMsgA.createdAt)
              : new Date(0);
            const timeB = latestMsgB?.createdAt
              ? new Date(latestMsgB.createdAt)
              : new Date(0);

            return timeB - timeA;
          })
          .map((mutualuser) => {
            const conversationId = conversationMap[mutualuser?._id];
            const conversationMessages = messages?.filter(
              (msg) => msg?.conversationId === conversationId
            );

            let latestMessage;
            if (conversationMessages && conversationMessages.length > 0) {
              latestMessage = conversationMessages.reduce((latest, current) =>
                new Date(current.createdAt) > new Date(latest.createdAt)
                  ? current
                  : latest
              );
            }

            const notificationMsg = chatNotifications?.[mutualuser._id];
            const showMessage = notificationMsg || latestMessage;

            // ✅ Truncate message if it's text, or use 📷/📎 for files/images
            let preview = "";
            if (showMessage?.file) {
              preview = showMessage.file?.type?.startsWith("image")
                ? "📷 Photo"
                : "📎 Attachment";
            } else if (showMessage?.messages) {
              const words = showMessage.messages.split(" ");
              preview =
                (showMessage?.senderId === user?._id ? "You: " : "") +
                words.slice(0, 5).join(" ") +
                (words.length > 5 ? " ..." : "");
            }

            const isUnread = !!notificationMsg;
            const isOnline = onlineUsers?.includes(mutualuser?._id);

            const timeAgo = showMessage?.createdAt
              ? dayjs(showMessage.createdAt).fromNow()
              : "";

            return (
              <div
                key={mutualuser?._id}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 rounded-lg"
                onClick={async () => {
                  if (selectedUsers?._id !== mutualuser?._id) {
                    const conversationId = await conversationMap[
                      mutualuser._id
                    ];
                    dispatch(
                      setselectedUsers({ ...mutualuser, conversationId })
                    );

                    // Clear unread notification
                    const updatedNotifications = { ...chatNotifications };
                    delete updatedNotifications[mutualuser._id];
                    dispatch(setChatNotifications(updatedNotifications));
                  }
                }}
              >
                <div className="relative w-fit">
                  <Avatar>
                    <AvatarImage src={mutualuser?.profilePicture} />
                    <AvatarFallback>{mutualuser?.username[0]}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute top-0 left-[-4px] w-3 h-3 rounded-full border-2 border-white ${
                      isOnline ? "bg-green-500" : "bg-red-400"
                    }`}
                  ></span>
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-center gap-2">
                    <span
                      className={`text-sm ${
                        isUnread ? "font-bold" : "font-medium"
                      }`}
                    >
                      {mutualuser?.username}
                    </span>
                    {timeAgo && (
                      <span className="text-xs text-gray-400">{timeAgo}</span>
                    )}
                  </div>
                  <span
                    className={`text-xs truncate max-w-[180px] ${
                      isUnread ? "text-black font-bold" : "text-gray-500"
                    }`}
                  >
                    {preview || (isOnline ? "Online" : "Offline")}
                  </span>
                </div>

                {isUnread && (
                  <span className="ml-auto h-2 w-2 bg-blue-500 rounded-full"></span>
                )}
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
              autoFocus
            />
            <Button onClick={() => sendMessageHandler(selectedUsers?._id)}>
              Send
            </Button>
            <input
              type="file"
              ref={inputfileRef}
              onChange={HandleFIleclick}
              className="hidden"
              autoFocus
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
