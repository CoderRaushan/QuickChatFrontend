// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import {
//   Heart,
//   Home,
//   LogOut as LogOutIcon,
//   MessageCircle,
//   PlusSquare,
//   Search,
//   TrendingUp,
// } from "lucide-react";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { setAuthUser } from "../ReduxStore/authSlice";
// import CreatePost from "./CreatePost.jsx";
// import { setisLogin } from "../ReduxStore/LoginSlice.js";
// import { markNotificationsAsSeen } from "../ReduxStore/RealTimeNotificationSlice.js";
// import CommentDialog from "./CommentDialog.jsx";
// import { setSelectedPost } from "../ReduxStore/PostSlice.js";

// function LeftSideBar() {
//   const [CommentOpen, setCommentOpen] = useState(false);
//   const { user } = useSelector((store) => store.auth);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [createPostOpen, setcreatePostOpen] = useState(false);
//   const [notification, setnotification] = useState(false);
//   const { UserProfile } = useSelector((state) => state.auth);
//   const { isLogin } = useSelector((store) => store.isLogin);
//   const { likeNotification, unseenCount, followNotification } = useSelector(
//     (store) => store.Notification
//   );

//   const CreatePostHandler = () => {
//     setcreatePostOpen(true);
//   };

//   const handleLogout = async () => {
//     const MainUri = import.meta.env.VITE_MainUri;
//     try {
//       const response = await axios.post(
//         `${MainUri}/user/signout`,
//         {},
//         {
//           withCredentials: true,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//       if (response.data.success) {
//         toast.success(response.data.message || "User logged out successfully!");
//         dispatch(setAuthUser(null));
//         dispatch(setisLogin(false));
//         navigate("/");
//       } else {
//         toast.error(response.data.message || "User logout failed!");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Logout error!");
//     }
//   };

//   const SideBarClickHandler = (text) => {
//     setnotification(false);
//     switch (text) {
//       case "Logout":
//         dispatch(setisLogin(false));
//         return handleLogout();
//       case "Create":
//         return CreatePostHandler();
//       case "Login":
//         return navigate("/signin");
//       case "Home":
//         return navigate("/");
//       case "Messages":
//         return navigate("/conversation");
//       case "Notifications":
//         return setnotification(true);
//       case "Profile":
//         return navigate(`/profile/${user?._id}`);
//       default:
//         return;
//     }
//   };

//   const sidebarItems = [
//     { icon: <Home />, text: "Home" },
//     { icon: <Search />, text: "Search" },
//     { icon: <TrendingUp />, text: "Explore" },
//     { icon: <MessageCircle />, text: "Messages" },
//     {
//       icon: notification ? (
//         <FaHeart size={"22px"} />
//       ) : (
//         <FaRegHeart size={"22px"} />
//       ),
//       text: "Notifications",
//     },
//     { icon: <PlusSquare />, text: "Create" },
//     {
//       icon: (
//         <Avatar>
//           <AvatarImage src={user?.profilePicture} alt="User Profile" />
//           <AvatarFallback>CN</AvatarFallback>
//         </Avatar>
//       ),
//       text: "Profile",
//     },
//     { icon: <LogOutIcon />, text: isLogin ? "Logout" : "Login" },
//   ];

//   return (
//     <div
//       className={`fixed top-0 z-10 left-0 px-4 border-r border-gray-300 bg-white flex flex-col h-screen
//         ${notification ? "w-full md:w-[23%]" : "w-[70px] sm:w-[100px] md:w-[16%]"}`}
//     >
//       {/* Logo */}
//       <h1 className="my-6 font-bold text-xl hidden md:block">Logo</h1>

//       {/* Sidebar Items */}
//       <div className="flex flex-col">
//         {sidebarItems.map((item, index) => (
//           <div
//             key={index}
//             onClick={() => SideBarClickHandler(item.text)}
//             className="hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-1 flex items-center gap-3 relative"
//           >
//             <div>{item.icon}</div>
//             <div className="hidden md:block">{item.text}</div>

//             {/* Notification Count */}
//             {item.text === "Notifications" && likeNotification.length > 0 && (
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     onClick={() => {
//                       dispatch(markNotificationsAsSeen());
//                     }}
//                     size="icon"
//                     className="rounded-full h-5 w-5 absolute -top-1 -right-1 bg-red-600 text-white"
//                   >
//                     {unseenCount}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-[300px]">
//                   <div>
//                     {[...(likeNotification || []), ...(followNotification || [])].length === 0 ? (
//                       <p>No new Notifications</p>
//                     ) : (
//                       [...(likeNotification || []), ...(followNotification || [])].map((notify) => (
//                         <div
//                           key={notify?.userId}
//                           className="flex items-center gap-2 p-1 cursor-pointer"
//                         >
//                           <Link to={`/profile/${notify?.userId}`}>
//                             <Avatar>
//                               <AvatarImage
//                                 src={notify?.userDetails?.profilePicture}
//                               />
//                             </Avatar>
//                           </Link>
//                           <p className="text-sm">
//                             <span className="font-bold">
//                               <Link
//                                 to={`/profile/${notify?.userId}`}
//                                 className="hover:underline"
//                               >
//                                 {notify?.userDetails?.username}
//                               </Link>
//                             </span>{" "}
//                             liked your post
//                           </p>
//                           <div>
//                             {user?.posts?.some(
//                               (item) => item?._id === notify?.postId
//                             ) && (
//                               <Avatar className="rounded-lg">
//                                 <AvatarImage
//                                   src={
//                                     user?.posts?.find(
//                                       (item) => item?._id === notify?.postId
//                                     )?.image || "default-image-url"
//                                   }
//                                   onClick={() => {
//                                     dispatch(
//                                       setSelectedPost(
//                                         UserProfile?.posts?.find(
//                                           (item) =>
//                                             item?._id === notify?.postId
//                                         )
//                                       )
//                                     );
//                                     setCommentOpen(true);
//                                   }}
//                                 />
//                               </Avatar>
//                             )}
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </PopoverContent>
//               </Popover>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Right Side Notification Panel */}
//       {notification && (
//         <div className="hidden md:block flex-col ml-4 mt-4 w-full">
//           <div className="font-bold text-xl mb-4">Notifications</div>
//           {likeNotification?.length === 0 ? (
//             <p>No new Notifications</p>
//           ) : (
//             likeNotification?.map((notify) => (
//               <div
//                 key={notify?.userId}
//                 className="flex items-center gap-2 p-1 cursor-pointer"
//               >
//                 <Link to={`/profile/${notify?.userId}`}>
//                   <Avatar>
//                     <AvatarImage
//                       src={notify?.userDetails?.profilePicture}
//                     />
//                   </Avatar>
//                 </Link>
//                 <p className="text-sm">
//                   <span className="font-bold">
//                     <Link
//                       to={`/profile/${notify?.userId}`}
//                       className="hover:underline"
//                     >
//                       {notify?.userDetails?.username}
//                     </Link>
//                   </span>{" "}
//                   liked your post
//                 </p>
//                 <div>
//                   {user?.posts?.some(
//                     (item) => item?._id === notify?.postId
//                   ) && (
//                     <Avatar className="rounded-lg">
//                       <AvatarImage
//                         src={
//                           user?.posts?.find(
//                             (item) => item?._id === notify?.postId
//                           )?.image || "default-image-url"
//                         }
//                         onClick={() => {
//                           dispatch(
//                             setSelectedPost(
//                               UserProfile?.posts?.find(
//                                 (item) => item?._id === notify?.postId
//                               )
//                             )
//                           );
//                           setCommentOpen(true);
//                         }}
//                       />
//                     </Avatar>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {/* Dialogs */}
//       <CreatePost
//         createPostOpen={createPostOpen}
//         setcreatePostOpen={setcreatePostOpen}
//       />
//       <CommentDialog
//         CommentOpen={CommentOpen}
//         setCommentOpen={setCommentOpen}
//       />
//     </div>
//   );
// }

// export default LeftSideBar;

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import axios from "axios";
// import {
//   Heart,
//   Home,
//   LogOut as LogOutIcon,
//   MessageCircle,
//   PlusSquare,
//   Search,
//   TrendingUp,
// } from "lucide-react";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { Button } from "@/components/ui/button";
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { setAuthUser } from "../ReduxStore/authSlice";
// import CreatePost from "./CreatePost.jsx";
// import { setisLogin } from "../ReduxStore/LoginSlice.js";
// import CommentDialog from "./CommentDialog.jsx";
// import { setSelectedPost } from "../ReduxStore/PostSlice.js";
// import { markNotificationsAsSeen } from "../ReduxStore/RealTimeNotificationSlice.js";
// import { FaInstagram } from "react-icons/fa";
// function LeftSideBar() {
//   const [CommentOpen, setCommentOpen] = useState(false);
//   const [createPostOpen, setcreatePostOpen] = useState(false);
//   const [notificationPanel, setNotificationPanel] = useState(false);

//   const { user, UserProfile } = useSelector((state) => state.auth);
//   const { isLogin } = useSelector((store) => store.isLogin);
//   const { likeNotification, unseenCount, followNotification } = useSelector(
//     (store) => store.Notification
//   );
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const handleLogout = async () => {
//     const MainUri = import.meta.env.VITE_MainUri;
//     try {
//       const response = await axios.post(
//         `${MainUri}/user/signout`,
//         {},
//         { withCredentials: true, headers: { "Content-Type": "application/json" } }
//       );
//       if (response.data.success) {
//         toast.success(response.data.message || "Logged out successfully!");
//         dispatch(setAuthUser(null));
//         dispatch(setisLogin(false));
//         navigate("/");
//       } else {
//         toast.error(response.data.message || "Logout failed!");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Logout error!");
//     }
//   };

//   const SideBarClickHandler = (text) => {
//     switch (text) {
//       case "Logout":
//         dispatch(setisLogin(false));
//         return handleLogout();
//       case "Create":
//         return setcreatePostOpen(true);
//       case "Login":
//         return navigate("/signin");
//       case "Home":
//         setNotificationPanel(false);
//         return navigate("/");
//       case "Messages":
//         setNotificationPanel(false);
//         return navigate("/conversation");
//       case "Notifications":
//         setNotificationPanel((prev) => !prev);
//         dispatch(markNotificationsAsSeen());
//         return;
//       case "Profile":
//         setNotificationPanel(false);
//         return navigate(`/profile/${user?._id}`);
//       default:
//         return;
//     }
//   };

//   const sidebarItems = [
//     { icon: <Home />, text: "Home" },
//     { icon: <Search />, text: "Search" },
//     { icon: <TrendingUp />, text: "Explore" },
//     { icon: <MessageCircle />, text: "Messages" },
//     {
//       icon: notificationPanel ? <FaHeart size={22} /> : <FaRegHeart size={22} />,
//       text: "Notifications",
//     },
//     { icon: <PlusSquare />, text: "Create" },
//     {
//       icon: (
//         <Avatar>
//           <AvatarImage src={user?.profilePicture} alt="User" />
//           <AvatarFallback>U</AvatarFallback>
//         </Avatar>
//       ),
//       text: "Profile",
//     },
//     { icon: <LogOutIcon />, text: isLogin ? "Logout" : "Login" },
//   ];

//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 z-20 h-screen border-r bg-white transition-all duration-300
//         ${notificationPanel ? "w-[70px]" : "w-[250px]"}`}
//       >
//         <div className="p-4">
//           {/* Logo */}
//           {/* {!notificationPanel && <h1 className="font-bold text-2xl mb-6">MyApp</h1>} */}
//           {notificationPanel?(<FaInstagram size={26} className="flex items-center justify-center"/>):(<h1 className="font-bold text-2xl mb-6">QuickChat</h1>)}
//           {/* Sidebar Items */}
//           <div className="flex flex-col space-y-3">
//             {sidebarItems.map((item, index) => (
//               <div
//                 key={index}
//                 onClick={() => SideBarClickHandler(item.text)}
//                 className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2 relative"
//               >
//                 <div>{item.icon}</div>
//                 {!notificationPanel && <span className="text-md">{item.text}</span>}

//                 {/* Notification Badge */}
//                 {item.text === "Notifications" && unseenCount > 0 && (
//                   <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
//                     {unseenCount}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Notification Slide Panel */}
//       {notificationPanel && (
//         <div className="fixed top-0 left-[70px] z-10 w-[350px] h-screen bg-white p-4 border-r shadow transition-all duration-300">
//           <h2 className="font-bold text-xl mb-4">Notifications</h2>
//           {[...(likeNotification || []), ...(followNotification || [])].length === 0 ? (
//             <p>No new notifications.</p>
//           ) : (
//             [...(likeNotification || []), ...(followNotification || [])].map((notify, idx) => (
//               <div key={idx} className="flex items-center gap-2 py-2 border-b">
//                 <Link to={`/profile/${notify?.userId}`}>
//                   <Avatar>
//                     <AvatarImage src={notify?.userDetails?.profilePicture} />
//                     <AvatarFallback>U</AvatarFallback>
//                   </Avatar>
//                 </Link>
//                 <div className="flex-1 text-sm">
//                   <Link to={`/profile/${notify?.userId}`} className="font-bold hover:underline">
//                     {notify?.userDetails?.username}
//                   </Link>{" "}
//                   liked your post
//                 </div>
//                 {user?.posts?.some((p) => p?._id === notify?.postId) && (
//                   <Avatar className="rounded-md">
//                     <AvatarImage
//                       src={
//                         user?.posts?.find((p) => p._id === notify?.postId)?.image ||
//                         "default-image-url"
//                       }
//                       onClick={() => {
//                         dispatch(
//                           setSelectedPost(
//                             UserProfile?.posts?.find((p) => p._id === notify?.postId)
//                           )
//                         );
//                         setCommentOpen(true);
//                       }}
//                     />
//                   </Avatar>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {/* Modals */}
//       <CreatePost createPostOpen={createPostOpen} setcreatePostOpen={setcreatePostOpen} />
//       <CommentDialog CommentOpen={CommentOpen} setCommentOpen={setCommentOpen} />
//     </div>
//   );
// }

// export default LeftSideBar;

// import {
//   Home, Search, TrendingUp, MessageCircle,
//   PlusSquare, LogOut as LogOutIcon
// } from "lucide-react";
// import { FaHeart, FaRegHeart, FaInstagram } from "react-icons/fa";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useState, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
// import { setAuthUser } from "../ReduxStore/authSlice";
// import { setisLogin } from "../ReduxStore/LoginSlice";
// import { markNotificationsAsSeen } from "../ReduxStore/RealTimeNotificationSlice";
// import { setSelectedPost } from "../ReduxStore/PostSlice";
// import CreatePost from "./CreatePost";
// import CommentDialog from "./CommentDialog";

// function LeftSideBar() {
//   /* ------------------------------ state / store ----------------------------- */
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [createPostOpen, setCreatePostOpen] = useState(false);
//   const [commentOpen, setCommentOpen] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);          // sidebar collapse
//   const [showPanel, setShowPanel] = useState(false);          // notif panel open

//   const { user, UserProfile } = useSelector((s) => s.auth);
//   const { isLogin }         = useSelector((s) => s.isLogin);
//   const { likeNotification, unseenCount, followNotification } = useSelector(
//     (s) => s.Notification
//   );

//   /* -------------------------------- handlers -------------------------------- */
//   const handleLogout = async () => {
//     const MainUri = import.meta.env.VITE_MainUri;
//     try {
//       await axios.post(`${MainUri}/user/signout`, {}, { withCredentials: true });
//       toast.success("Logout Successful!");
//       dispatch(setAuthUser(null));
//       dispatch(setisLogin(false));
//       navigate("/");
//     } catch {
//       toast.error("Logout Failed!");
//     }
//   };

//   const handleSidebarClick = (text) => {
//     switch (text) {
//       case "Logout":     return handleLogout();
//       case "Login":      return navigate("/signin");
//       case "Create":     return setCreatePostOpen(true);
//       case "Home":
//         setCollapsed(false); setShowPanel(false); return navigate("/");
//       case "Messages":
//         setCollapsed(false); setShowPanel(false); return navigate("/conversation");
//       case "Notifications":
//         setCollapsed(true);                      // sidebar icon‑only
//         setShowPanel((p) => !p);                 // toggle panel
//         dispatch(markNotificationsAsSeen());
//         return;
//       case "Profile":
//         setCollapsed(false); setShowPanel(false);
//         return navigate(`/profile/${user?._id}`);
//       default: return;
//     }
//   };

//   /* --------------------------------- items ---------------------------------- */
//   const items = useMemo(() => [
//     { icon: <Home className="w-6 h-6" />,               label: "Home" },
//     { icon: <Search className="w-6 h-6" />,             label: "Search" },
//     { icon: <TrendingUp className="w-6 h-6" />,         label: "Explore" },
//     { icon: <MessageCircle className="w-6 h-6" />,      label: "Messages" },
//     { icon: collapsed
//             ? <FaHeart className="w-6 h-6" />
//             : <FaRegHeart className="w-6 h-6" />,       label: "Notifications" },
//     { icon: <PlusSquare className="w-6 h-6" />,         label: "Create" },
//     { icon: (
//         <Avatar className="h-6 w-6">
//           <AvatarImage src={user?.profilePicture} className="object-cover"/>
//           <AvatarFallback>U</AvatarFallback>
//         </Avatar>
//       ),                                                label: "Profile" },
//     { icon: <LogOutIcon className="w-6 h-6" />,         label: isLogin ? "Logout" : "Login" },
//   ], [collapsed, isLogin, user?.profilePicture]);

//   /* --------------------------------- render --------------------------------- */
//   return (
//     <div className="flex">
//       {/* ─────────────────────── Sidebar ─────────────────────── */}
//       <div className={`fixed top-0 left-0 h-screen bg-white border-r z-30
//                        transition-all duration-300 ${collapsed ? "w-[70px]" : "w-[250px]"}`}>
//         <div className="p-4">
//           {collapsed
//             ? <FaInstagram size={26} className="mb-6" />
//             : <h1 className="font-bold text-2xl mb-6">QuickChat</h1>}

//           <div className="flex flex-col space-y-3">
//             {items.map(({ icon, label }, idx) => (
//               <div
//                 key={idx}
//                 title={collapsed ? label : undefined}
//                 onClick={() => handleSidebarClick(label)}
//                 className="flex items-center gap-3 cursor-pointer
//                            hover:bg-gray-100 rounded-md px-3 py-2 relative"
//               >
//                 {icon}
//                 {!collapsed && <span>{label}</span>}

//                 {label === "Notifications" && unseenCount > 0 && (
//                   <div className="absolute -top-1 -right-1 bg-red-600 h-5 w-5
//                                   text-white text-xs flex items-center justify-center rounded-full">
//                     {unseenCount}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ─────────────── Notification Slide Panel (Animated) ─────────────── */}
//       <AnimatePresence>
//         {showPanel && (
//           <motion.div
//             key="notif-panel"
//             initial={{ x: "-100%" }}               // off‑canvas (from left)
//             animate={{ x: 0 }}
//             exit={{ x: "-100%" }}
//             transition={{ type: "tween", duration: 0.35 }}
//             className="fixed top-0 left-[70px] h-screen w-[350px] bg-white
//                        border-r shadow-md p-4 z-20"
//           >
//             <h2 className="font-bold text-xl mb-4">Notifications</h2>

//             {[...(likeNotification||[]), ...(followNotification||[])].length === 0
//               ? <p>No new notifications.</p>
//               : [...(likeNotification||[]), ...(followNotification||[])].map((n, idx) => (
//                   <div key={idx} className="flex items-center gap-2 py-2 border-b">
//                     <Avatar>
//                       <AvatarImage src={n?.userDetails?.profilePicture}/>
//                       <AvatarFallback>U</AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1 text-sm">
//                       <span className="font-bold">{n?.userDetails?.username}</span>{" "}
//                       liked your post
//                     </div>
//                     {user?.posts?.some((p)=>p._id===n?.postId) && (
//                       <Avatar
//                         className="h-10 w-10 cursor-pointer"
//                         onClick={()=>{
//                           const post = UserProfile?.posts?.find((p)=>p._id===n?.postId);
//                           dispatch(setSelectedPost(post));
//                           setCommentOpen(true);
//                         }}
//                       >
//                         <AvatarImage
//                           src={user?.posts?.find((p)=>p._id===n?.postId)?.image||"default.jpg"}
//                           className="object-cover"
//                         />
//                       </Avatar>
//                     )}
//                   </div>
//                 ))
//             }
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ─────────────────────────── Modals ─────────────────────────── */}
//       <CreatePost  createPostOpen={createPostOpen} setcreatePostOpen={setCreatePostOpen}/>
//       <CommentDialog CommentOpen={commentOpen} setCommentOpen={setCommentOpen}/>
//     </div>
//   );
// }

// export default LeftSideBar;

// src/components/LeftSideBar.jsx

// import {
//   Home,
//   Search,
//   TrendingUp,
//   MessageCircle,
//   PlusSquare,
//   LogOut as LogOutIcon,
// } from "lucide-react";
// import { FaHeart, FaRegHeart, FaInstagram } from "react-icons/fa";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useState, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
// import { setAuthUser } from "../ReduxStore/authSlice";
// import { setisLogin } from "../ReduxStore/LoginSlice";
// import { markNotificationsAsSeen } from "../ReduxStore/RealTimeNotificationSlice";
// import { setSelectedPost } from "../ReduxStore/PostSlice";
// import CreatePost from "./CreatePost";
// import CommentDialog from "./CommentDialog";

// function LeftSideBar() {
//   /* ───────── local state ───────── */
//   const [collapsed, setCollapsed] = useState(false);
//   const [openNotif, setOpenNotif] = useState(false);
//   const [openSearch, setOpenSearch] = useState(false);
//   const [createOpen, setCreateOpen] = useState(false);
//   const [commentOpen, setCommentOpen] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   console.log(searchText);
//   /* ───────── redux state ───────── */
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user, UserProfile } = useSelector((s) => s.auth);
//   const { isLogin } = useSelector((s) => s.isLogin);
//   const { likeNotification, unseenCount, followNotification } = useSelector(
//     (s) => s.Notification
//   );

//   /* ───────── helpers ───────── */
//   const closePanels = () => {
//     setOpenNotif(false);
//     setOpenSearch(false);
//   };

//   const logoutUser = async () => {
//     try {
//       const uri = import.meta.env.VITE_MainUri;
//       await axios.post(`${uri}/user/signout`, {}, { withCredentials: true });
//       dispatch(setAuthUser(null));
//       dispatch(setisLogin(false));
//       toast.success("Logged out");
//       navigate("/");
//     } catch {
//       toast.error("Logout failed");
//     }
//   };

//   const handleClick = (label) => {
//     switch (label) {
//       case "Home":
//         closePanels();
//         setCollapsed(false);
//         navigate("/");
//         break;

//       case "Messages":
//         closePanels();
//         setCollapsed(false);
//         navigate("/conversation");
//         break;

//       case "Profile":
//         closePanels();
//         setCollapsed(false);
//         navigate(`/profile/${user?._id}`);
//         break;

//       case "Create":
//         setCreateOpen(true);
//         break;

//       case "Notifications":
//         closePanels();
//         setCollapsed(true);
//         setOpenNotif(true);
//         dispatch(markNotificationsAsSeen());
//         break;

//       case "Search":
//         closePanels();
//         setCollapsed(true);
//         setOpenSearch(true);
//         break;

//       case "Login":
//         navigate("/signin");
//         break;

//       case "Logout":
//         logoutUser();
//         break;

//       default:
//         break;
//     }
//   };

//   /* ───────── sidebar items ───────── */
//   const items = useMemo(
//     () => [
//       { icon: <Home className="w-6 h-6" />, label: "Home" },
//       { icon: <Search className="w-6 h-6" />, label: "Search" },
//       { icon: <TrendingUp className="w-6 h-6" />, label: "Explore" },
//       { icon: <MessageCircle className="w-6 h-6" />, label: "Messages" },
//       {
//         icon: collapsed ? (
//           <FaHeart className="w-6 h-6" />
//         ) : (
//           <FaRegHeart className="w-6 h-6" />
//         ),
//         label: "Notifications",
//       },
//       { icon: <PlusSquare className="w-6 h-6" />, label: "Create" },
//       {
//         icon: (
//           <Avatar className="h-6 w-6">
//             <AvatarImage src={user?.profilePicture} className="object-cover" />
//             <AvatarFallback>U</AvatarFallback>
//           </Avatar>
//         ),
//         label: "Profile",
//       },
//       {
//         icon: <LogOutIcon className="w-6 h-6" />,
//         label: isLogin ? "Logout" : "Login",
//       },
//     ],
//     [collapsed, isLogin, user?.profilePicture]
//   );

//   /* ───────── render ───────── */
//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 h-screen bg-white border-r z-30
//                        transition-all duration-300 ${
//                          collapsed ? "w-[70px]" : "w-[250px]"
//                        }`}
//       >
//         <div className="p-4">
//           {collapsed ? (
//             <FaInstagram size={26} className="mb-6" />
//           ) : (
//             <h1 className="font-bold text-2xl mb-6">QuickChat</h1>
//           )}
//           <div className="flex flex-col space-y-3">
//             {items.map(({ icon, label }) => (
//               <div
//                 key={label}
//                 onClick={() => handleClick(label)}
//                 title={collapsed ? label : undefined}
//                 className="flex items-center gap-3 px-3 py-2 cursor-pointer relative
//                               hover:bg-gray-100 rounded-md"
//               >
//                 {icon}
//                 {!collapsed && <span>{label}</span>}
//                 {label === "Notifications" && unseenCount > 0 && (
//                   <span
//                     className="absolute -top-1 -right-1 w-5 h-5 rounded-full
//                                    bg-red-600 text-white text-xs flex items-center justify-center"
//                   >
//                     {unseenCount}
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Notification Panel */}
//       <AnimatePresence>
//         {openNotif && (
//           <motion.div
//             key="notif"
//             initial={{ x: "-100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "-100%" }}
//             transition={{ type: "tween", duration: 0.35 }}
//             className="fixed top-0 left-[70px] h-screen w-[350px] bg-white
//                        border-r shadow-md p-4 z-20"
//           >
//             <h2 className="font-bold text-xl mb-4">Notifications</h2>
//             {[...(likeNotification || []), ...(followNotification || [])]
//               .length === 0 ? (
//               <p>No new notifications.</p>
//             ) : (
//               [...(likeNotification || []), ...(followNotification || [])].map(
//                 (n, i) => (
//                   <div
//                     key={i}
//                     className="flex items-center gap-2 py-2 border-b"
//                   >
//                     <Avatar>
//                       <AvatarImage src={n?.userDetails?.profilePicture} />
//                       <AvatarFallback>U</AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1 text-sm">
//                       <span className="font-bold">
//                         {n?.userDetails?.username}
//                       </span>{" "}
//                       liked your post
//                     </div>
//                     {user?.posts?.some((p) => p._id === n?.postId) && (
//                       <Avatar
//                         className="h-10 w-10 cursor-pointer"
//                         onClick={() => {
//                           const post = UserProfile?.posts?.find(
//                             (p) => p._id === n?.postId
//                           );
//                           dispatch(setSelectedPost(post));
//                           setCommentOpen(true);
//                         }}
//                       >
//                         <AvatarImage
//                           src={
//                             user?.posts?.find((p) => p._id === n?.postId)
//                               ?.image || "default.jpg"
//                           }
//                           className="object-cover"
//                         />
//                       </Avatar>
//                     )}
//                   </div>
//                 )
//               )
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Search Panel */}
//       <AnimatePresence>
//         {openSearch && (
//           <motion.div
//             key="search"
//             initial={{ x: "-100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "-100%" }}
//             transition={{ type: "tween", duration: 0.35 }}
//             className="fixed top-0 left-[70px] h-screen w-[350px] bg-white
//                      border-r shadow-md p-4 z-20"
//           >
//             <h2 className="font-bold text-xl mb-4">Search</h2>

//             {/* 🔁 Wrap input and button in a relative container */}
//             <div className="relative mb-4">
//               <input
//                 type="text"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 placeholder="Search..."
//                 className="w-full border rounded px-3 py-2 pr-8 focus:outline-none"
//               />
//               {searchText && (
//                 <button
//                   onClick={() => setSearchText("")}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black text-lg"
//                 >
//                   &times;
//                 </button>
//               )}
//             </div>

//             <p className="text-gray-500 mb-1">Recent</p>
//             <ul className="space-y-2 text-sm">
//               <li className="cursor-pointer hover:text-black">raushan_kumar</li>
//             </ul>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Modals */}
//       <CreatePost
//         createPostOpen={createOpen}
//         setcreatePostOpen={setCreateOpen}
//       />
//       <CommentDialog
//         CommentOpen={commentOpen}
//         setCommentOpen={setCommentOpen}
//       />
//     </div>
//   );
// }

// export default LeftSideBar;// this is final code

// ----------------------- LeftSideBar.jsx -----------------------

import {
  Home,
  Search,
  TrendingUp,
  MessageCircle,
  PlusSquare,
  LogOut as LogOutIcon,
  LogInIcon,
} from "lucide-react";
import { FaHeart, FaRegHeart, FaInstagram } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import { setAuthUser, setSearchResults } from "../ReduxStore/authSlice";
import { setisLogin } from "../ReduxStore/LoginSlice";
import { markNotificationsAsSeen } from "../ReduxStore/RealTimeNotificationSlice";
import { setSelectedPost } from "../ReduxStore/PostSlice";
import CreatePost from "./CreatePost";
import CommentDialog from "./CommentDialog";

function LeftSideBar() {
  /* ───────── local state ───────── */
  const [collapsed, setCollapsed] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [loadingTop, setloadingTop] = useState(false);

  const [searchText, setSearchText] = useState("");
  // const [SearchResults, setSearchResults] = useState([]);
  const [typingTimer, setTypingTimer] = useState(null);

  /* ───────── redux state ───────── */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, UserProfile, SearchResults } = useSelector((s) => s.auth);
  const { isLogin } = useSelector((s) => s.isLogin);
  const { likeNotification, unseenCount, followNotification } = useSelector(
    (s) => s.Notification
  );
  /* ───────── helpers ───────── */
  const closePanels = () => {
    setOpenNotif(false);
    setOpenSearch(false);
  };

  const logoutUser = async () => {
    try {
      const uri = import.meta.env.VITE_MainUri;
      await axios.post(`${uri}/user/signout`, {}, { withCredentials: true });
      dispatch(setAuthUser(null));
      dispatch(setisLogin(false));
      toast.success("Logged out");
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  const handleClick = (label) => {
    switch (label) {
      case "Home":
        closePanels();
        setCollapsed(false);
        navigate("/");
        break;

      case "Messages":
        closePanels();
        setCollapsed(false);
        navigate("/conversation");
        break;

      case "Profile":
        closePanels();
        setCollapsed(false);
        navigate(`/profile/${user?._id}`);
        break;

      case "Create":
        setCreateOpen(true);
        break;

      case "Notifications":
        closePanels();
        setCollapsed(true);
        setOpenNotif(true);
        dispatch(markNotificationsAsSeen());
        break;

      case "Search":
        closePanels();
        setCollapsed(true);
        setOpenSearch(true);
        break;

      case "Login":
        navigate("/signin");
        break;

      case "Logout":
        logoutUser();
        break;

      default:
        break;
    }
  };

  /* ───────── sidebar items ───────── */
  const items = useMemo(
    () => [
      { icon: <Home className="w-6 h-6" />, label: "Home" },
      { icon: <Search className="w-6 h-6" />, label: "Search" },
      { icon: <TrendingUp className="w-6 h-6" />, label: "Explore" },
      { icon: <MessageCircle className="w-6 h-6" />, label: "Messages" },
      {
        icon: collapsed ? (
          <FaHeart className="w-6 h-6" />
        ) : (
          <FaRegHeart className="w-6 h-6" />
        ),
        label: "Notifications",
      },
      { icon: <PlusSquare className="w-6 h-6" />, label: "Create" },
      {
        icon: (
          <Avatar className="h-6 w-6">
            <AvatarImage src={user?.profilePicture} className="object-cover" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        ),
        label: "Profile",
      },
      {
        icon: isLogin ? (
          <LogOutIcon className="w-6 h-6" />
        ) : (
          <LogInIcon className="w-6 h-6" />
        ),
        label: isLogin ? "Logout" : "Login",
      },
    ],
    [collapsed, isLogin, user?.profilePicture]
  );
  /* ───────── search – debounce + API fetch ───────── */
  useEffect(() => {
    if (typingTimer) clearTimeout(typingTimer);

    const handler = setTimeout(async () => {
      if (!searchText.trim()) {
        return;
      }
      try {
        setloadingTop(true);
        const MainUri = import.meta.env.VITE_MainUri;
        const res = await axios.post(
          `${MainUri}/user/search`,
          {
            username: searchText,
          },
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          setloadingTop(false);
          dispatch(setSearchResults(res?.data?.searchedUser));
        }
      } catch {
        dispatch(setSearchResults([]));
        setloadingTop(false);
      }
    }, 2000);

    setTypingTimer(handler);
    return () => clearTimeout(handler);
  }, [searchText]);
  /* ───────── render ───────── */
  return (
    <div className="flex">
      {/* ---------------- Sidebar ---------------- */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white border-r z-30
          transition-all duration-300 ${collapsed ? "w-[70px]" : "w-[250px]"}`}
      >
        <div className="p-4">
          {collapsed ? (
            <FaInstagram size={26} className="mb-6" />
          ) : (
            <h1 className="font-bold text-2xl mb-6">QuickChat</h1>
          )}
          <div className="flex flex-col space-y-3">
            {items?.map(({ icon, label }) => (
              <div
                key={label}
                onClick={() => handleClick(label)}
                title={collapsed ? label : undefined}
                className="flex items-center gap-3 px-3 py-4 cursor-pointer
                  hover:bg-gray-100 rounded-md relative"
              >
                {icon}
                {!collapsed && <span>{label}</span>}
                {label === "Notifications" && unseenCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full
                      bg-red-600 text-white text-xs flex items-center justify-center"
                  >
                    {unseenCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- Notification Panel ---------------- */}
      <AnimatePresence>
        {openNotif && (
          <motion.div
            key="notif"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed top-0 left-[70px] h-screen w-[350px] bg-white
              border-r shadow-md p-4 z-20"
          >
            <h2 className="font-bold text-xl mb-4">Notifications</h2>
            {[...(likeNotification || []), ...(followNotification || [])]
              .length === 0 ? (
              <p>No new notifications.</p>
            ) : (
              [...(likeNotification || []), ...(followNotification || [])]?.map(
                (n, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 py-2 border-b"
                  >
                    <Avatar>
                      <AvatarImage src={n?.userDetails?.profilePicture} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-sm">
                      <span className="font-bold">
                        {n?.userDetails?.username}
                      </span>{" "}
                      liked your post
                    </div>
                    {user?.posts?.some((p) => p?._id === n?.postId) && (
                      <Avatar
                        className="h-10 w-10 cursor-pointer"
                        onClick={() => {
                          const post = UserProfile?.posts?.find(
                            (p) => p?._id === n?.postId
                          );
                          dispatch(setSelectedPost(post));
                          setCommentOpen(true);
                        }}
                      >
                        <AvatarImage
                          src={
                            user?.posts?.find((p) => p?._id === n?.postId)
                              ?.image || "default.jpg"
                          }
                          className="object-cover"
                        />
                      </Avatar>
                    )}
                  </div>
                )
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- Search Panel ---------------- */}
      <AnimatePresence>
        {openSearch && (
          <motion.div
            key="search"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed top-0 left-[70px] h-screen w-[350px] bg-white
              border-r shadow-md p-4 z-20 overflow-y-auto"
          >
            <h2 className="font-bold text-xl mb-4">Search</h2>

            {/* Input + clear button */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search users..."
                className="w-full border rounded px-3 py-2 pr-8 focus:outline-none"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2
                    text-gray-500 hover:text-black text-lg"
                >
                  &times;
                </button>
              )}
            </div>
            {loadingTop && (
              <div className="flex justify-center py-1">
                <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
              </div>
            )}

            {/* Results (avatar + name horizontal) */}
            {/* ---------------- Search Panel ---------------- */}
            <AnimatePresence>
              {openSearch && (
                <motion.div
                  key="search"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "tween", duration: 0.35 }}
                  className="fixed top-0 left-[70px] h-screen w-[350px] bg-white border-r shadow-md p-4 z-20 overflow-y-auto"
                >
                  <h2 className="font-bold text-xl mb-4">Search</h2>

                  {/* Input + clear button */}
                  <div className="relative mb-4">
                    <input
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search users..."
                      className="w-full border rounded px-3 py-2 pr-8 focus:outline-none"
                    />
                    {searchText && (
                      <button
                        onClick={() => setSearchText("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black text-lg"
                      >
                        &times;
                      </button>
                    )}
                  </div>

                  {/* Loader */}
                  {loadingTop && (
                    <div className="flex justify-center py-1">
                      <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Results or Recent Searches */}
                  {(searchText || SearchResults?.length > 0) && (
                    <>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-gray-500">
                          {searchText ? "Results" : "Recent Searches"}
                        </p>
                        {!searchText && SearchResults?.length > 0 && (
                          <button
                            className="text-xs text-red-500 hover:underline"
                            onClick={() => dispatch(setSearchResults([]))}
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {SearchResults?.length === 0 ? (
                        <p className="text-sm text-gray-400 mb-2">
                          No match found
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {SearchResults?.map((u) => (
                            <Link
                              to={`/profile/${u._id}`}
                              key={u._id}
                              onClick={() => setOpenSearch(false)}
                            >
                              <li className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                                <Avatar>
                                  <AvatarImage src={u?.profilePicture} />
                                  <AvatarFallback>
                                    {u?.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-start justify-center">
                                  <span className="font-semibold leading-none">
                                    {u?.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    @{u?.username}
                                  </span>
                                </div>
                              </li>
                            </Link>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Static recent (only when no search) */}
            {!searchText && (
              <>
                <p className="text-gray-500 mb-1">Recent Searchs</p>
                <ul className="space-y-2 text-sm">
                  <li className="cursor-pointer hover:text-black"></li>
                </ul>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- Modals ---------------- */}
      <CreatePost
        createPostOpen={createOpen}
        setcreatePostOpen={setCreateOpen}
      />
      <CommentDialog
        CommentOpen={commentOpen}
        setCommentOpen={setCommentOpen}
      />
    </div>
  );
}

export default LeftSideBar;
