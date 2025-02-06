import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const sidebarItems = [
  { icon: <Home />, text: "Home" },
  { icon: <Search />, text: "Search" },
  { icon: <TrendingUp />, text: "Explore" },
  { icon: <MessageCircle />, text: "Messages" },
  { icon: <Heart />, text: "Notifications" },
  { icon: <PlusSquare />, text: "Create" },
  {
    icon: (
      <Avatar>
        <AvatarImage
          src="https://github.com/shadcn.png"
          alt="@shadcn"
          className="h-10 w-10 rounded-lg"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    text: "Profile",
  },
  { icon: <LogOut />, text: "Logout" },
];
function LeftSideBar() {
    const navigate=useNavigate();
    const LogOut=async()=>
    {
       const Logouturi=import.meta.env.VITE_logout;
       try {
        const response= await axios.post(Logouturi,{ 
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
          });
        if(response.data.success)
        {
            navigate("/");
            toast.success(response.data.message || "User Logout successfully!")
        }
        else 
        {
            toast.error(response.data.message || "User Logout fail!")
        }
       } catch (error) 
       {
        toast.error(error.response.data.message || "User Logout error!")
       } 
    }
    const SideBarClickHandler=(text)=>
    {
        switch(text)
        {
            case "Logout":  return LogOut();
        }
    }       
  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300  w-[16%] h-screen">
      <div className="flex flex-col">
        <h1>Logo</h1>
        {sidebarItems.map((item, index) => {
          return (
            <div
              onClick={()=>SideBarClickHandler(item.text)}
              key={index}
              className="hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 flex items-center gap-3 relative"
            >
              <div>{item.icon}</div>
              <div>{item.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LeftSideBar;
