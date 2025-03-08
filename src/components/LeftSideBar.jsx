import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Home,
  LogOut as LogOutIcon,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, redirect, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setAuthUser } from "../ReduxStore/authSlice";
import CreatePost from "./CreatePost.jsx";
import { setisLogin } from "../ReduxStore/LoginSlice.js";
import { markNotificationsAsSeen } from "../ReduxStore/RealTimeNotificationSlice.js";
import CommentDialog from "./CommentDialog.jsx";
import { setSelectedPost } from "../ReduxStore/PostSlice.js";
function LeftSideBar() {
  const [CommentOpen, setCommentOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createPostOpen, setcreatePostOpen] = useState(false);
  const [notification, setnotification] = useState(false);
  const { UserProfile } = useSelector((state) => state.auth);
  const { isLogin } = useSelector((store) => store.isLogin);
  const { likeNotification, unseenCount,followNotification } = useSelector(
    (store) => store.Notification
  );
  console.log(followNotification)
  const CreatePostHandler = () => {
    setcreatePostOpen(true);
  };
  const handleLogout = async () => {
    const logoutUri = import.meta.env.VITE_logout;
    try {
      const response = await axios.post(
        logoutUri,
        {},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message || "User logged out successfully!");
        dispatch(setAuthUser(null));
        dispatch(setisLogin(false));
        navigate("/");
      } else {
        toast.error(response.data.message || "User logout failed!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout error!");
    }
  };

  const SideBarClickHandler = (text) => {
    setnotification(false);
    switch (text) {
      case "Logout":
        dispatch(setisLogin(false));
        return handleLogout();
      case "Create":
        return CreatePostHandler();
      case "Login":
        return navigate("/signin");
      case "Home":
        return navigate("/");
      // case "Search":
      //   return navigate("/search");
      // case "Explore":
      //   return navigate("/explore");
      case "Messages":
        return navigate("/conversation");
      case "Notifications":
        return setnotification(true);
      // case "Create":
      //   return navigate("/create");
      case "Profile":
        return navigate(`/profile/${user?._id}`);
      default:
        return;
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    {
      icon: notification ? (
        <FaHeart size={"22px"} />
      ) : (
        <FaRegHeart size={"22px"} />
      ),
      text: "Notifications",
    },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar>
          <AvatarImage src={user?.profilePicture} alt="User Profile" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOutIcon />, text: isLogin ? "Logout" : "Login" },
  ];

  return (
    <div
      className={`fixed top-0 z-10 left-0 px-4 border-r border-gray-300 ${notification?"w-[23%]":"w-[16%]"} h-screen bg-white flex`}
    >
      <div className="flex flex-col">
        <h1 className="my-8 pl-3 font-bold text-xl cursor-pointer">Logo</h1>
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            onClick={() => SideBarClickHandler(item.text)}
            className={`hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 flex items-center gap-3 relative ${notification?"":"pr-[88px]"}`}
          >
            <div>{item.icon}</div>
            {!notification && <div>{item.text}</div>}{" "}
            {/* Hide text when hideText is true */}
            {item.text === "Notifications" && likeNotification.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    onClick={() => {
                      dispatch(markNotificationsAsSeen());
                    }}
                    size="icon"
                    className="rounded-full h-5 w-5 absolute bottom-6 left-6 bg-red-600 hover:bg-red-600"
                  >
                    {unseenCount}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div>
                    {
                    likeNotification?.length === 0 && followNotification?.length === 0 ? (
                      <p>No new Notification</p>
                    ) : (
                      [...(likeNotification || []), ...(followNotification || [])].map((notify) => {
                        return (
                          <div
                            key={notify?.userId}
                            className="flex items-center gap-2 p-1 cursor-pointer"
                          >
                            <Link to={`/profile/${notify?.userId}`}>
                              <Avatar>
                                <AvatarImage
                                  src={notify?.userDetails?.profilePicture}
                                ></AvatarImage>
                              </Avatar>
                            </Link>
                            <p className="text-sm ">
                              <span className="font-bold">
                                <Link
                                  to={`/profile/${notify?.userId}`}
                                  className="hover:underline"
                                >
                                  {notify?.userDetails?.username}
                                </Link>
                              </span>{" "}
                              liked your post
                            </p>
                            <div>
                              {user?.posts?.some(
                                (item) => item?._id === notify?.postId
                              ) && (
                                <Avatar className="rounded-lg">
                                  <AvatarImage
                                    src={
                                      user?.posts?.find(
                                        (item) => item?._id === notify?.postId
                                      )?.image || "default-image-url"
                                    }
                                    onClick={() => {
                                      dispatch(
                                        setSelectedPost(
                                          UserProfile?.posts?.find(
                                            (item) =>
                                              item?._id === notify?.postId
                                          )
                                        )
                                      );
                                      setCommentOpen(true);
                                    }}
                                  />
                                </Avatar>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )
                    
                    }
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-start my-4 justify-center">
        {notification && (
          <div className="flex flex-col">
            <div className="font-bold p-4 text-xl w-[290px]">Notification</div>
            <div className="flex flex-col gap-2">
              {likeNotification?.length === 0 ? (
                <p>No new Notification</p>
              ) : (
                likeNotification?.map((notify) => {
                  return (
                    <div
                      key={notify?.userId}
                      className="flex items-center gap-2 p-1 cursor-pointer"
                    >
                      <Link to={`/profile/${notify?.userId}`}>
                        <Avatar>
                          <AvatarImage
                            src={notify?.userDetails?.profilePicture}
                          ></AvatarImage>
                        </Avatar>
                      </Link>
                      <p className="text-sm ">
                        <span className="font-bold">
                          <Link
                            to={`/profile/${notify?.userId}`}
                            className="hover:underline"
                          >
                            {notify?.userDetails?.username}
                          </Link>
                        </span>{" "}
                        liked your post
                      </p>
                      <div>
                        {user?.posts?.some(
                          (item) => item?._id === notify?.postId
                        ) && (
                          <Avatar className="rounded-lg">
                            <AvatarImage
                              src={
                                user?.posts?.find(
                                  (item) => item?._id === notify?.postId
                                )?.image || "default-image-url"
                              }
                              onClick={() => {
                                dispatch(
                                  setSelectedPost(
                                    UserProfile?.posts?.find(
                                      (item) => item?._id === notify?.postId
                                    )
                                  )
                                );
                                setCommentOpen(true);
                              }}
                            />
                          </Avatar>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
      <CreatePost
        createPostOpen={createPostOpen}
        setcreatePostOpen={setcreatePostOpen}
      />
      <CommentDialog
        CommentOpen={CommentOpen}
        setCommentOpen={setCommentOpen}
      />
    </div>
  );
}

export default LeftSideBar;
