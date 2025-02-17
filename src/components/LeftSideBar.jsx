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
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setAuthUser } from "../ReduxStore/authSlice";

function LeftSideBar() {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch=useDispatch();
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
        return handleLogout();
      // case "Home":
      //   return navigate("/");
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
      // case "Profile":
      //   return navigate("/profile");
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
            src={user?.logedinUser?.profilePicture || ""}
            alt="User Profile"
            className="h-10 w-10 rounded-lg"
          />
          <AvatarFallback>{user?.logedinUser?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      ),
      text:user?.logedinUser?.name || "",
    },
    { icon: <LogOutIcon />, text: "Logout" },
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
    </div>
  );
}

export default LeftSideBar;
