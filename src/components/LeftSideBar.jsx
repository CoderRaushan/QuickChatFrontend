import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import {
  Heart,
  Home,
  LogOut as LogOutIcon,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { redirect, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setAuthUser } from "../ReduxStore/authSlice";
import CreatePost from "./CreatePost.jsx";
import { setisLogin } from "../ReduxStore/LoginSlice.js";
function LeftSideBar() {
  const { user } = useSelector((store) => store.auth);
  const navigate =useNavigate();
  const dispatch=useDispatch();
  const [createPostOpen,setcreatePostOpen]=useState(false);
  const {isLogin}=useSelector((store)=>store.isLogin);
  const CreatePostHandler=()=>
  {
    setcreatePostOpen(true);
  }
  const handleLogout = async () => {
    const logoutUri = import.meta.env.VITE_logout;
    try {
      const response = await axios.post(
        logoutUri,
        {},
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        toast.success(response.data.message || "User logged out successfully!");
        dispatch(setAuthUser(null));
        navigate("/");
      } else {
        toast.error(response.data.message || "User logout failed!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout error!");
    }
  };

  const SideBarClickHandler = (text) => {
    switch (text) {
      case "Logout":
        dispatch(setisLogin(false));
        return handleLogout();
      case "Create":
        return CreatePostHandler();
      case "Login":
        return  navigate("/signin");
      case "Home":
        return navigate("/");
      // case "Search":
      //   return navigate("/search");
      // case "Explore":
      //   return navigate("/explore");
      // case "Messages":
      //   return navigate("/messages");
      // case "Notifications":
      //   return navigate("/notifications");
      // case "Create":
      //   return navigate("/create");
      case "Profile":
        return navigate(`/profile/${user?.user?._id}`);
      default:
        return;
    }
  };

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
            src={user?.user?.profilePicture }
            alt="User Profile"
            className="h-10 w-10 rounded-lg"
          />
          <AvatarFallback>{user?.user?.name?.charAt(0) || ""}</AvatarFallback>
        </Avatar>
      ),
      text:"Profile",
    },
    { icon:<LogOutIcon /> , text:isLogin ? "Logout": "Login" },
  ];

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen bg-white">
      <div className="flex flex-col">
        <h1 className="my-8 pl-3 font-bold text-xl">Logo</h1>
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            onClick={() => SideBarClickHandler(item.text)}
            className="hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 flex items-center gap-3 relative"
          >
            <div>{item.icon}</div>
            <div>{item.text}</div>
          </div>
        ))}
      </div>
      <CreatePost createPostOpen={createPostOpen} setcreatePostOpen={setcreatePostOpen}/>
    </div>
  );
}

export default LeftSideBar;
