import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import GetAllMessages from "../Hooks/useGetAllMessages.jsx";
import useGetRTMmessage from "../Hooks/useGetRTMmessage.jsx";
import { CircleArrowOutDownRightIcon } from "lucide-react";
function Messages({ selectedUsers }) {
  useGetRTMmessage();
  GetAllMessages();
  const { messages } = useSelector((store) => store.chat);
  const {user}=useSelector((store)=>store.auth);
  const messagesEndRef = useRef(null);
   // Scroll to the latest message
   useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedUsers?.profilePicture} />
            <AvatarFallback>Cn</AvatarFallback>
          </Avatar>
          <span>{selectedUsers?.username}</span>
          <Link to={`/profile/${selectedUsers?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {messages?.map((msg) => {
          return (
            <div className={`flex ${msg?.senderId === user?._id ? 'justify-end':"justify-start"}`} key={msg?._id}>
              <div className={`p-2 rounded-lg max-w-xs break-words ${msg?.senderId === user?._id ? "bg-blue-500 text-white":"bg-gray-200 text-black" }`}>{msg?.messages}</div>
            </div>
          );
        })}
         {/* Invisible div to auto-scroll */}
         <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default Messages;
