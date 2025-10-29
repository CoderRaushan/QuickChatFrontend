
// import {
//   Home,
//   Search,
//   TrendingUp,
//   MessageCircle,
//   PlusSquare,
//   LogOut as LogOutIcon,
//   LogInIcon,
// } from "lucide-react";
// import { FaHeart, FaRegHeart, FaInstagram } from "react-icons/fa";
// import { BsSend } from "react-icons/bs";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useState, useMemo, useEffect } from "react";
// import { MdOutlineExplore } from "react-icons/md";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { setAuthUser, setSearchResults } from "../ReduxStore/authSlice";
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
//   const [loadingTop, setloadingTop] = useState(false);
//   const navigate = useNavigate();

//   const [searchText, setSearchText] = useState("");
//   // const [SearchResults, setSearchResults] = useState([]);
//   const [typingTimer, setTypingTimer] = useState(null);

//   /* ───────── redux state ───────── */
//   const dispatch = useDispatch();
//   const { user, UserProfile, SearchResults } = useSelector((s) => s.auth);
//   const chatNotifications = useSelector(
//     (state) => state.chat.chatNotifications
//   );
//   const unreadCountMessage = Object.keys(chatNotifications || {}).length;
//   const { isLogin } = useSelector((s) => s.isLogin);
//   const {
//     likeNotification,
//     unseenCount,
//     followNotification,
//     commentNotification,
//   } = useSelector((s) => s.Notification);
//   // console.log("likeNotification,",likeNotification.post);
//   /* ───────── helpers ───────── */
//   const closePanels = () => {
//     setOpenNotif(false);
//     setOpenSearch(false);
//   };

//   const logoutUser = async () => {
//     try {
//       navigate("/signin");
//       if (user) {
//         const uri = import.meta.env.VITE_MainUri;
//         await axios.post(`${uri}/user/signout`, {}, { withCredentials: true });
//         dispatch(setAuthUser(null));
//         dispatch(setisLogin(false));
//         toast.success("Logged out");
//         navigate("/");
//       } else {
//         navigate("/signin");
//       }
//     } catch (error) {
//       toast.error("Logout failed");
//       console.log(error);
//     }
//   };

//   const HandleNotificationClick = async (notification) => {
//     if (notification.type === "follow") {
//       navigate(`/profile/${notification?.userDetails?._id}`);
//     }
//     if (notification.type === "like") {
//       const res = await axios.get(
//         `${import.meta.env.VITE_MainUri}/user/post/get/specificpost/${
//           notification?.postId
//         }`,
//         { withCredentials: true }
//       );
//       if (res.data.success) {
//         const data = res.data;
//         dispatch(setSelectedPost(data?.post || {}));
//         setCommentOpen(true);
//       }
//     }
//     if (notification.type === "comment") {
//       const res = await axios.get(
//         `${import.meta.env.VITE_MainUri}/user/post/get/specificpost/${
//           notification?.postId
//         }`,
//         { withCredentials: true }
//       );
//       if (res.data.success) {
//         const data = res.data;
//         dispatch(setSelectedPost(data?.post || {}));
//         setCommentOpen(true);
//       }
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

//       case "Explore":
//         navigate("/explore");
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
//       { icon: <MdOutlineExplore className="w-6 h-6" />, label: "Explore" },
//       { icon: <BsSend className="w-6 h-6" />, label: "Messages" },
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
//         icon: isLogin ? (
//           <LogOutIcon className="w-6 h-6" />
//         ) : (
//           <LogInIcon className="w-6 h-6" />
//         ),
//         label: isLogin ? "Logout" : "Login",
//       },
//     ],
//     [collapsed, isLogin, user?.profilePicture]
//   );
//   /* ───────── search – debounce + API fetch ───────── */
//   useEffect(() => {
//     if (typingTimer) clearTimeout(typingTimer);

//     const handler = setTimeout(async () => {
//       if (!searchText.trim()) {
//         return;
//       }
//       try {
//         setloadingTop(true);
//         const MainUri = import.meta.env.VITE_MainUri;
//         const res = await axios.post(
//           `${MainUri}/user/search`,
//           {
//             username: searchText,
//           },
//           {
//             withCredentials: true,
//           }
//         );
//         if (res.data.success) {
//           setloadingTop(false);
//           dispatch(setSearchResults(res?.data?.searchedUser));
//         }
//       } catch {
//         dispatch(setSearchResults([]));
//         setloadingTop(false);
//       }
//     }, 2000);

//     setTypingTimer(handler);
//     return () => clearTimeout(handler);
//   }, [searchText]);
//   /* ───────── render ───────── */
//   return (
//     <div className="flex">
//       {/* ---------------- Sidebar ---------------- */}
//       <div
//         className={`fixed top-0 left-0 h-screen bg-white border-r z-30
//           transition-all duration-300 ${collapsed ? "w-[70px]" : "w-[250px]"}`}
//       >
//         <div className="p-4">
//           {collapsed ? (
//             <FaInstagram size={26} className="mb-6" />
//           ) : (
//             <h1 className="font-bold text-2xl mb-6">QuickChat</h1>
//           )}
//           <div className="flex flex-col space-y-3">
//             {items?.map(({ icon, label }) => (
//               <div
//                 key={label}
//                 onClick={() => handleClick(label)}
//                 title={collapsed ? label : undefined}
//                 className="flex items-center gap-3 px-3 py-4 cursor-pointer
//                   hover:bg-gray-100 rounded-md relative"
//               >
//                 {icon}
//                 {!collapsed && <span>{label}</span>}
//                 {label === "Notifications" && unseenCount > 0 && (
//                   <span
//                     className="absolute  top-2 right-[175px] w-5 h-5 rounded-full
//                       bg-red-600 text-white text-xs flex items-center justify-center"
//                   >
//                     {unseenCount}
//                   </span>
//                 )}
//                 {label === "Messages" && unreadCountMessage > 0 && (
//                   <span
//                     className="absolute top-2 right-[175px] w-5 h-5 rounded-full
//                       bg-red-600 text-white text-xs flex items-center justify-center"
//                   >
//                     {unreadCountMessage}
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ---------------- Notification Panel ---------------- */}
//       <AnimatePresence>
//         {openNotif && (
//           <motion.div
//             key="notif"
//             initial={{ x: "-100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "-100%" }}
//             transition={{ type: "tween", duration: 0.35 }}
//             className="fixed top-0 left-[70px] h-screen w-[350px] bg-white
//               border-r shadow-md p-4 z-20 overflow-y-auto smooth-scroll"
//           >
//             <h2 className="font-bold text-xl mb-4">Notifications</h2>
//             {[
//               ...(likeNotification || []),
//               ...(followNotification || []),
//               ...(commentNotification || []),
//             ].length === 0 ? (
//               <p>No new notifications.</p>
//             ) : (
//               [
//                 ...(commentNotification || []),
//                 ...(likeNotification || []),
//                 ...(followNotification || []),
//               ]?.map((n, i) => (
//                 <div
//                   onClick={() => HandleNotificationClick(n)}
//                   key={i}
//                   className="flex items-center gap-2 py-2 border-b cursor-pointer hover:bg-gray-200 "
//                 >
//                   <Avatar>
//                     <AvatarImage src={n?.userDetails?.profilePicture} />
//                     <AvatarFallback>U</AvatarFallback>
//                   </Avatar>

//                   <div className="flex-1 text-sm">
//                     <span className="font-bold">
//                       {n?.userDetails?.username}
//                     </span>{" "}
//                     {n?.message}
//                   </div>

//                   {user?.posts?.some((p) => p?._id === n?.postId) && (
//                     <Avatar
//                       className="h-10 w-10 cursor-pointer"
//                       onClick={() => {
//                         const post = UserProfile?.posts?.find(
//                           (p) => p?._id === n?.postId
//                         );
//                         dispatch(setSelectedPost(post));
//                         setCommentOpen(true);
//                       }}
//                     >
//                       <AvatarImage
//                         src={
//                           user?.posts?.find((p) => p?._id === n?.postId)
//                             ?.image || "default.jpg"
//                         }
//                         className="object-cover"
//                       />
//                     </Avatar>
//                   )}
//                 </div>
//               ))
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ---------------- Search Panel ---------------- */}
//       <AnimatePresence>
//         {openSearch && (
//           <motion.div
//             key="search"
//             initial={{ x: "-100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "-100%" }}
//             transition={{ type: "tween", duration: 0.35 }}
//             className="fixed top-0 left-[70px] h-screen w-[350px] bg-white
//               border-r shadow-md p-4 z-20 overflow-y-auto"
//           >
//             <h2 className="font-bold text-xl mb-4">Search</h2>

//             {/* Input + clear button */}
//             <div className="relative mb-4">
//               <input
//                 type="text"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 placeholder="Search users..."
//                 className="w-full border rounded px-3 py-2 pr-8 focus:outline-none"
//               />
//               {searchText && (
//                 <button
//                   onClick={() => setSearchText("")}
//                   className="absolute right-2 top-1/2 -translate-y-1/2
//                     text-gray-500 hover:text-black text-lg"
//                 >
//                   &times;
//                 </button>
//               )}
//             </div>
//             {loadingTop && (
//               <div className="flex justify-center py-1">
//                 <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
//               </div>
//             )}

//             {/* Results (avatar + name horizontal) */}
//             {/* ---------------- Search Panel ---------------- */}
//             <AnimatePresence>
//               {openSearch && (
//                 <motion.div
//                   key="search"
//                   initial={{ x: "-100%" }}
//                   animate={{ x: 0 }}
//                   exit={{ x: "-100%" }}
//                   transition={{ type: "tween", duration: 0.35 }}
//                   className="fixed top-0 left-[70px] h-screen w-[350px] bg-white border-r shadow-md p-4 z-20 overflow-y-auto"
//                 >
//                   <h2 className="font-bold text-xl mb-4">Search</h2>

//                   {/* Input + clear button */}
//                   <div className="relative mb-4">
//                     <input
//                       type="text"
//                       value={searchText}
//                       onChange={(e) => setSearchText(e.target.value)}
//                       placeholder="Search users..."
//                       className="w-full border rounded px-3 py-2 pr-8 focus:outline-none"
//                     />
//                     {searchText && (
//                       <button
//                         onClick={() => setSearchText("")}
//                         className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black text-lg"
//                       >
//                         &times;
//                       </button>
//                     )}
//                   </div>

//                   {/* Loader */}
//                   {loadingTop && (
//                     <div className="flex justify-center py-1">
//                       <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
//                     </div>
//                   )}

//                   {/* Results or Recent Searches */}
//                   {(searchText || SearchResults?.length > 0) && (
//                     <>
//                       <div className="flex justify-between items-center mb-1">
//                         <p className="text-gray-500">
//                           {searchText ? "Results" : "Recent Searches"}
//                         </p>
//                         {!searchText && SearchResults?.length > 0 && (
//                           <button
//                             className="text-xs text-red-500 hover:underline"
//                             onClick={() => dispatch(setSearchResults([]))}
//                           >
//                             Clear
//                           </button>
//                         )}
//                       </div>

//                       {SearchResults?.length === 0 ? (
//                         <p className="text-sm text-gray-400 mb-2">
//                           No match found
//                         </p>
//                       ) : (
//                         <ul className="space-y-2">
//                           {SearchResults?.map((u) => (
//                             <Link
//                               to={`/profile/${u._id}`}
//                               key={u._id}
//                               onClick={() => setOpenSearch(false)}
//                             >
//                               <li className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
//                                 <Avatar>
//                                   <AvatarImage src={u?.profilePicture} />
//                                   <AvatarFallback>
//                                     {u?.name
//                                       ?.split(" ")
//                                       .map((n) => n[0])
//                                       .join("")}
//                                   </AvatarFallback>
//                                 </Avatar>
//                                 <div className="flex flex-col items-start justify-center">
//                                   <span className="font-semibold leading-none">
//                                     {u?.name}
//                                   </span>
//                                   <span className="text-xs text-gray-500">
//                                     @{u?.username}
//                                   </span>
//                                 </div>
//                               </li>
//                             </Link>
//                           ))}
//                         </ul>
//                       )}
//                     </>
//                   )}
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Static recent (only when no search) */}
//             {!searchText && (
//               <>
//                 <p className="text-gray-500 mb-1">Recent Searchs</p>
//                 <ul className="space-y-2 text-sm">
//                   <li className="cursor-pointer hover:text-black"></li>
//                 </ul>
//               </>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ---------------- Modals ---------------- */}
//       <CreatePost
//         createPostOpen={createOpen}
//         setcreatePostOpen={setCreateOpen}
//         target={"Create"}
//       />
//       <CommentDialog
//         CommentOpen={commentOpen}
//         setCommentOpen={setCommentOpen}
//       />
//     </div>
//   );
// }

// export default LeftSideBar;
import {
  Home,
  Search,
  MessageCircle,
  PlusSquare,
  LogOut as LogOutIcon,
  LogIn as LogInIcon,
} from "lucide-react";
import { FaHeart, FaRegHeart, FaInstagram } from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MdOutlineExplore } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
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
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [typingTimer, setTypingTimer] = useState(null);

  /* ───────── redux state ───────── */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, UserProfile, SearchResults } = useSelector((s) => s.auth);
  const chatNotifications = useSelector((state) => state.chat.chatNotifications);
  const unreadCountMessage = Object.keys(chatNotifications || {}).length;
  const { isLogin } = useSelector((s) => s.isLogin);
  const {
    likeNotification,
    unseenCount,
    followNotification,
    commentNotification,
  } = useSelector((s) => s.Notification);

  /* ───────── helpers ───────── */
  const closePanels = () => {
    setOpenNotif(false);
    setOpenSearch(false);
    setCollapsed(false);
  };

  const logoutUser = async () => {
    try {
      if (user) {
        const uri = import.meta.env.VITE_MainUri;
        await axios.post(`${uri}/user/signout`, {}, { withCredentials: true });
        dispatch(setAuthUser(null));
        dispatch(setisLogin(false));
        toast.success("Logged out");
      }
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);
    }
  };

  const HandleNotificationClick = async (notification) => {
    try {
      if (notification.type === "follow") {
        closePanels();
        navigate(`/profile/${notification?.userDetails?._id}`);
        return;
      }

      if (notification.type === "like" || notification.type === "comment") {
        const res = await axios.get(
          `${import.meta.env.VITE_MainUri}/user/post/get/specificpost/${notification?.postId}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setSelectedPost(res.data.post || {}));
          setCommentOpen(true);
        }
      }
    } catch (error) {
      console.error("Error handling notification:", error);
      toast.error("Failed to load post");
    }
  };

  const handleClick = (label) => {
    switch (label) {
      case "Home":
        closePanels();
        navigate("/");
        break;

      case "Messages":
        closePanels();
        navigate("/conversation");
        break;

      case "Profile":
        closePanels();
        navigate(`/profile/${user?._id}`);
        break;

      case "Create":
        setCreateOpen(true);
        break;

      case "Explore":
        closePanels();
        navigate("/explore");
        break;

      case "Notifications":
        if (openNotif) {
          closePanels();
        } else {
          setOpenSearch(false);
          setCollapsed(true);
          setOpenNotif(true);
          dispatch(markNotificationsAsSeen());
        }
        break;

      case "Search":
        if (openSearch) {
          closePanels();
        } else {
          setOpenNotif(false);
          setCollapsed(true);
          setOpenSearch(true);
        }
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

  /* ───────── search – debounce + API fetch ───────── */
  useEffect(() => {
    if (typingTimer) clearTimeout(typingTimer);

    if (!searchText.trim()) {
      dispatch(setSearchResults([]));
      setLoadingSearch(false);
      return;
    }

    setLoadingSearch(true);
    const handler = setTimeout(async () => {
      try {
        const MainUri = import.meta.env.VITE_MainUri;
        const res = await axios.post(
          `${MainUri}/user/search`,
          { username: searchText },
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setSearchResults(res?.data?.searchedUser || []));
        }
      } catch (error) {
        console.error("Search error:", error);
        dispatch(setSearchResults([]));
      } finally {
        setLoadingSearch(false);
      }
    }, 500); // Reduced from 2000ms to 500ms

    setTypingTimer(handler);
    return () => clearTimeout(handler);
  }, [searchText, dispatch]);

  /* ───────── clear search on panel close ───────── */
  useEffect(() => {
    if (!openSearch) {
      setSearchText("");
      dispatch(setSearchResults([]));
    }
  }, [openSearch, dispatch]);

  /* ───────── sidebar items ───────── */
  const items = useMemo(
    () => [
      { icon: <Home className="w-6 h-6" />, label: "Home" },
      { icon: <Search className="w-6 h-6" />, label: "Search" },
      { icon: <MdOutlineExplore className="w-6 h-6" />, label: "Explore" },
      { icon: <BsSend className="w-6 h-6" />, label: "Messages" },
      {
        icon: openNotif ? (
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
    [openNotif, isLogin, user?.profilePicture]
  );

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
            <FaInstagram size={26} className="mb-6 mx-auto" />
          ) : (
            <h1 className="font-bold text-2xl mb-6">QuickChat</h1>
          )}
          <div className="flex flex-col space-y-4">
            {items.map(({ icon, label }) => (
              <div
                key={label}
                onClick={() => handleClick(label)}
                title={collapsed ? label : undefined}
                className="flex items-center gap-3 px-3 py-3 cursor-pointer
                  hover:bg-gray-100 rounded-lg relative transition-colors"
              >
                <div className="relative">
                  {icon}
                  {/* Notification badges on icons when collapsed */}
                  {collapsed && label === "Notifications" && unseenCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full
                      bg-red-600 text-white text-[10px] flex items-center justify-center">
                      {unseenCount > 9 ? '9+' : unseenCount}
                    </span>
                  )}
                  {collapsed && label === "Messages" && unreadCountMessage > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full
                      bg-red-600 text-white text-[10px] flex items-center justify-center">
                      {unreadCountMessage > 9 ? '9+' : unreadCountMessage}
                    </span>
                  )}
                </div>
                {!collapsed && <span className="font-medium">{label}</span>}
                
                {/* Notification badges on text when expanded */}
                {!collapsed && label === "Notifications" && unseenCount > 0 && (
                  <span className="ml-auto w-5 h-5 rounded-full
                    bg-red-600 text-white text-xs flex items-center justify-center">
                    {unseenCount > 9 ? '9+' : unseenCount}
                  </span>
                )}
                {!collapsed && label === "Messages" && unreadCountMessage > 0 && (
                  <span className="ml-auto w-5 h-5 rounded-full
                    bg-red-600 text-white text-xs flex items-center justify-center">
                    {unreadCountMessage > 9 ? '9+' : unreadCountMessage}
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
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-[70px] h-screen w-[350px] bg-white
              border-r shadow-lg p-4 z-20 overflow-y-auto"
          >
            <h2 className="font-bold text-xl mb-4">Notifications</h2>
            
            {[
              ...(commentNotification || []),
              ...(likeNotification || []),
              ...(followNotification || []),
            ].length === 0 ? (
              <p className="text-gray-500 text-sm">No new notifications.</p>
            ) : (
              <div className="space-y-1">
                {[
                  ...(commentNotification || []),
                  ...(likeNotification || []),
                  ...(followNotification || []),
                ].map((n, i) => (
                  <div
                    onClick={() => HandleNotificationClick(n)}
                    key={i}
                    className="flex items-center gap-3 py-3 px-2 rounded-lg
                      cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={n?.userDetails?.profilePicture} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-sm">
                      <span className="font-semibold">
                        {n?.userDetails?.username}
                      </span>{" "}
                      <span className="text-gray-600">{n?.message}</span>
                    </div>

                    {n?.postId && user?.posts?.some((p) => p?._id === n?.postId) && (
                      <Avatar className="h-10 w-10 rounded-md">
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
                ))}
              </div>
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
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-[70px] h-screen w-[350px] bg-white
              border-r shadow-lg p-4 z-20 overflow-y-auto"
          >
            <h2 className="font-bold text-xl mb-4">Search</h2>

            {/* Input + clear button */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search users..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              {searchText && (
                <button
                  onClick={() => {
                    setSearchText("");
                    dispatch(setSearchResults([]));
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                    text-gray-400 hover:text-gray-600 text-xl font-light"
                >
                  ×
                </button>
              )}
            </div>

            {/* Loading indicator */}
            {loadingSearch && (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 
                  rounded-full animate-spin" />
              </div>
            )}

            {/* Search results */}
            {searchText && !loadingSearch && (
              <>
                {SearchResults?.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No users found
                  </p>
                ) : (
                  <div className="space-y-1">
                    {SearchResults?.map((u) => (
                      <Link
                        to={`/profile/${u._id}`}
                        key={u._id}
                        onClick={() => closePanels()}
                      >
                        <div className="flex items-center gap-3 p-2 rounded-lg
                          cursor-pointer hover:bg-gray-100 transition-colors">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={u?.profilePicture} />
                            <AvatarFallback>
                              {u?.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-semibold text-sm truncate">
                              {u?.username}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              {u?.name}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Empty state when no search */}
            {!searchText && !loadingSearch && (
              <div className="text-center py-8 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Search for users</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- Modals ---------------- */}
      <CreatePost
        createPostOpen={createOpen}
        setcreatePostOpen={setCreateOpen}
        target="Create"
      />
      <CommentDialog
        CommentOpen={commentOpen}
        setCommentOpen={setCommentOpen}
      />
    </div>
  );
}

export default LeftSideBar;