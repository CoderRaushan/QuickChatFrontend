// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import React, { useEffect, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import GetAllMessages from "../Hooks/useGetAllMessages.jsx";
// import useGetRTMmessage from "../Hooks/useGetRTMmessage.jsx";
// import { CircleArrowOutDownRightIcon } from "lucide-react";
// function Messages({ selectedUsers }) {
//   useGetRTMmessage();
//   GetAllMessages();
//   const { messages } = useSelector((store) => store.chat);
//   const {user}=useSelector((store)=>store.auth);
//   const messagesEndRef = useRef(null);
//    // Scroll to the latest message
//    useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="overflow-y-auto flex-1 p-4">
//       <div className="flex justify-center">
//         <div className="flex flex-col items-center justify-center">
//           <Avatar className="h-20 w-20">
//             <AvatarImage src={selectedUsers?.profilePicture} />
//             <AvatarFallback>Cn</AvatarFallback>
//           </Avatar>
//           <span>{selectedUsers?.username}</span>
//           <Link to={`/profile/${selectedUsers?._id}`}>
//             <Button className="h-8 my-2" variant="secondary">
//               View Profile
//             </Button>
//           </Link>
//         </div>
//       </div>
//       <div className="flex flex-col gap-3">
//         {messages?.map((msg) => {
//           return (
//             <div className={`flex ${msg?.senderId === user?._id ? 'justify-end':"justify-start"}`} key={msg?._id}>
//               <div className={`p-2 rounded-lg max-w-xs break-words ${msg?.senderId === user?._id ? "bg-blue-500 text-white":"bg-gray-200 text-black" }`}>{msg?.messages}</div>
//             </div>
//           );
//         })}
//          {/* Invisible div to auto-scroll */}
//          <div ref={messagesEndRef} />
//       </div>
//     </div>
//   );  
// }

// export default Messages;

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import React, { useEffect, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import GetAllMessages from "../Hooks/useGetAllMessages.jsx";
// import useGetRTMmessage from "../Hooks/useGetRTMmessage.jsx";
// import { CheckCheck, Check, CircleArrowOutDownRightIcon } from "lucide-react";

// function Messages({ selectedUsers }) {
//   useGetRTMmessage();
//   GetAllMessages();

//   const { messages } = useSelector((store) => store.chat);
//   const { user } = useSelector((store) => store.auth);
//   const { socket } = useSelector((store) => store.socketio);
//   const messagesEndRef = useRef(null);

//   // Emit "seen" for messages from the other user when opening this chat
//   useEffect(() => {
//     messages.forEach((msg) => {
//       if (msg.receiverId === user._id && msg.status !== "seen") {
//         socket.emit("message-seen", msg._id);
//       }
//     });
//   }, [messages, user._id, socket]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="overflow-y-auto flex-1 p-4">
//       <div className="flex justify-center">
//         <div className="flex flex-col items-center justify-center">
//           <Avatar className="h-20 w-20">
//             <AvatarImage src={selectedUsers?.profilePicture} />
//             <AvatarFallback>Cn</AvatarFallback>
//           </Avatar>
//           <span>{selectedUsers?.username}</span>
//           <Link to={`/profile/${selectedUsers?._id}`}>
//             <Button className="h-8 my-2" variant="secondary">
//               View Profile
//             </Button>
//           </Link>
//         </div>
//       </div>

//       <div className="flex flex-col gap-3 mt-4">
//         {messages?.map((msg) => {
//           const isSender = msg.senderId === user._id;

//           return (
//             <div
//               key={msg._id}
//               className={`flex ${isSender ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`relative p-2 rounded-lg max-w-xs break-words ${
//                   isSender
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-200 text-black"
//                 }`}
//               >
//                 {msg?.messages}

//                 {/* ✅ Tick indicators for messages sent by current user */}
//                 {isSender && (
//                   <span className="absolute -bottom-5 right-1 text-xs flex items-center gap-1">
//                     {msg.status === "sent" && <Check size={16} className="text-white" />}
//                     {msg.status === "delivered" && (
//                       <CheckCheck size={16} className="text-white" />
//                     )}
//                     {msg.status === "seen" && (
//                       <CheckCheck size={16} className="text-blue-300" />
//                     )}
//                   </span>
//                 )}
//               </div>
//             </div>
//           );
//         })}

//         {/* Scroll-to-bottom div */}
//         <div ref={messagesEndRef} />
//       </div>
//     </div>
//   );
// }

// export default Messages;

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import React, { useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import GetAllMessages from "../Hooks/useGetAllMessages.jsx";
// import useGetRTMmessage from "../Hooks/useGetRTMmessage.jsx";
// import { CheckCheck, Check } from "lucide-react";

// // Format time like WhatsApp (HH:MM)
// function formatTime(dateStr) {
//   const date = new Date(dateStr);
//   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// }

// function Messages({ selectedUsers }) {
//   useGetRTMmessage();
//   GetAllMessages();

//   const { messages } = useSelector((store) => store.chat);
//   const { user } = useSelector((store) => store.auth);
//   const { socket } = useSelector((store) => store.socketio);
//   const messagesEndRef = useRef(null);

//   // Emit "seen" and "delivered" statuses
//   useEffect(() => {
//     messages.forEach((msg) => {
//       if (msg.receiverId === user._id) {
//         if (msg.status === "sent") {
//           socket.emit("message-delivered", msg._id);
//         }
//         if (msg.status !== "seen") {
//           socket.emit("message-seen", msg._id);
//         }
//       }
//     });
//   }, [messages, user._id, socket]);

//   // Auto scroll to latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="overflow-y-auto flex-1 p-4">
//       <div className="flex justify-center">
//         <div className="flex flex-col items-center justify-center">
//           <Avatar className="h-20 w-20">
//             <AvatarImage src={selectedUsers?.profilePicture} />
//             <AvatarFallback>Cn</AvatarFallback>
//           </Avatar>
//           <span>{selectedUsers?.username}</span>
//           <Link to={`/profile/${selectedUsers?._id}`}>
//             <Button className="h-8 my-2" variant="secondary">
//               View Profile
//             </Button>
//           </Link>
//         </div>
//       </div>

//       <div className="flex flex-col gap-3 mt-4">
//         {messages?.map((msg) => {
//           const isSender = msg.senderId === user._id;

//           return (
//             <div
//               key={msg._id}
//               className={`flex ${isSender ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`relative p-2 rounded-lg max-w-xs break-words ${
//                   isSender
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-200 text-black"
//                 }`}
//               >
//                 <div className="flex flex-col">
//                   <span>{msg?.messages}</span>

//                   {/* Time and status icons in a single line (WhatsApp style) */}
//                   <div className="flex justify-end items-center gap-1 text-xs mt-1">
//                     <span className={`${isSender ? "text-gray-200" : "text-gray-600"}`}>
//                       {formatTime(msg.createdAt)}
//                     </span>

//                     {isSender && (
//                       <>
//                         {msg.status === "sent" && (
//                           <Check size={14} className="text-white" />
//                         )}
//                         {msg.status === "delivered" && (
//                           <CheckCheck size={14} className="text-white" />
//                         )}
//                         {msg.status === "seen" && (
//                           <CheckCheck size={14} className="text-blue-300" />
//                         )}
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}

//         {/* Scroll-to-bottom div */}
//         <div ref={messagesEndRef} />
//       </div>
//     </div>
//   );
// }

// export default Messages;

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import GetAllMessages from "../Hooks/useGetAllMessages.jsx";
// import useGetRTMmessage from "../Hooks/useGetRTMmessage.jsx";
// import { CheckCheck, Check } from "lucide-react";
// import React, { useEffect, useRef } from "react";

// function formatTime(dateStr) {
//   const date = new Date(dateStr);
//   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// }

// function Messages({ selectedUsers }) {
//   useGetRTMmessage();
//   GetAllMessages();

//   const { messages } = useSelector((store) => store.chat);
//   const { user } = useSelector((store) => store.auth);
//   const { socket } = useSelector((store) => store.socketio);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messages.forEach((msg) => {
//       if (msg.receiverId === user._id) {
//         if (msg.status === "sent") {
//           socket.emit("message-delivered", msg._id);
//         }
//         if (msg.status !== "seen") {
//           socket.emit("message-seen", msg._id);
//         }
//       }
//     });
//   }, [messages, user._id, socket]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="overflow-y-auto flex-1 p-4">
//       <div className="flex justify-center">
//         <div className="flex flex-col items-center justify-center">
//           <Avatar className="h-20 w-20">
//             <AvatarImage src={selectedUsers?.profilePicture} />
//             <AvatarFallback>U</AvatarFallback>
//           </Avatar>
//           <span>{selectedUsers?.username}</span>
//           <Link to={`/profile/${selectedUsers?._id}`}>
//             <Button className="h-8 my-2" variant="secondary">
//               View Profile
//             </Button>
//           </Link>
//         </div>
//       </div>

//       <div className="flex flex-col gap-3 mt-4">
//         {messages?.map((msg) => {
//           const isSender = msg.senderId === user._id;
//           return (
//             <div key={msg._id} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
//               <div
//                 className={`relative p-2 rounded-lg max-w-xs break-words ${
//                   isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
//                 }`}
//               >
//                 <div className="flex flex-col">
//                   <span>{msg?.messages}</span>
//                   <div className="flex justify-end items-center gap-1 text-xs mt-1">
//                     <span>{formatTime(msg.createdAt)}</span>
//                     {isSender && (
//                       <>
//                         {msg.status === "sent" && <Check size={14} />}
//                         {msg.status === "delivered" && <CheckCheck size={14} />}
//                         {msg.status === "seen" && <CheckCheck size={14} className="text-blue-300" />}
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>
//     </div>
//   );
// }

// export default Messages;

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import GetAllMessages from "../Hooks/useGetAllMessages.jsx";
import useGetRTMmessage from "../Hooks/useGetRTMmessage.jsx";
import { CheckCheck, Check } from "lucide-react";
import React, { useEffect, useRef } from "react";

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function Messages({ selectedUsers }) {
  useGetRTMmessage();
  GetAllMessages();

  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) {
      console.warn("Socket not connected. Skipping emit calls.");
      return;
    }

    messages.forEach((msg) => {
      if (msg.receiverId === user._id) {
        if (msg.status === "sent") {
          socket.emit("message-delivered", msg._id);
        }
        if (msg.status !== "seen") {
          socket.emit("message-seen", msg._id);
        }
      }
    });
  }, [messages, user._id, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedUsers?.profilePicture} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span>{selectedUsers?.username}</span>
          <Link to={`/profile/${selectedUsers?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View Profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        {messages?.map((msg) => {
          const isSender = msg.senderId === user._id;
          return (
            <div key={msg._id} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
              <div
                className={`relative p-2 rounded-lg max-w-xs break-words ${
                  isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                }`}
              >
                <div className="flex flex-col">
                  <span>{msg?.messages}</span>
                  <div className="flex justify-end items-center gap-1 text-xs mt-1">
                    <span>{formatTime(msg.createdAt)}</span>
                    {isSender && (
                      <>
                        {msg.status === "sent" && <Check size={14} />}
                        {msg.status === "delivered" && <CheckCheck size={14} />}
                        {msg.status === "seen" && <CheckCheck size={14} className="text-blue-300" />}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default Messages;
