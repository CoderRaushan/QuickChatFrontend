// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { setselectedUsers } from "../ReduxStore/authSlice.js";
// import { Button } from "@/components/ui/button";
// import { MessageCircleCode } from "lucide-react";
// import Messages from "./Messages.jsx";
// import { setMessages } from "../ReduxStore/ChatSlice.js";
// import axios from "axios";
// import { toast } from "react-toastify";
// function Conversation() {
//   const dispatch = useDispatch();
//   const { user, selectedUsers } = useSelector((store) => store.auth);
//   const { onlineUsers } = useSelector((store) => store.chat);
//   const [mutualFollowers, setMutualFollowers] = useState([]);
//   const [TextMsg, setTextMsg] = useState("");
//   const { messages } = useSelector((store) => store.chat);
//   useEffect(() => {
//     if (user) {
//       const followingSet = new Set(user?.following.map((f) => String(f._id)));
//       const mutuals = user?.followers.filter((f) =>
//         followingSet.has(String(f._id))
//       );
//       setMutualFollowers(mutuals);
//     }
//   }, [user]);

//   const sendMessageHandler = async (ReceiverId) => {
//     try {
//       const res = await axios.post(
//         `http://localhost:7464/user/message/send/${ReceiverId}`,
//         { text: TextMsg },
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );
//       if (res.data.success) {
//         dispatch(setMessages([...messages, res.data.newMessage]));
//         setTextMsg("");
//         toast.success(res.data.message);
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const navigate = useNavigate();
//   useEffect(() => {
//     if (!user) {
//       navigate("/signin");
//     }
//   }, [user, navigate]);
//   useEffect(() => {
//     return () => {
//       dispatch(setselectedUsers(null));
//     };
//   }, []);
//   return (
//     <div className="flex ml-[16%] h-screen">
//       <section>
//         <h1 className="font-bold mb-4 px-3 text-xl mt-6">{user?.username}</h1>
//         <hr className="mb-4 border-gray-300" />
//         <div className="overflow-y-auto h-[80vh] px-2">
//           <h1 className="font-bold mb-4 px-3 text-xl mt-6">Messages</h1>
//           {mutualFollowers.map((mutualuser) => {
//             const isOnline = onlineUsers.includes(mutualuser?._id);
//             return (
//               <div
//                 key={mutualuser?._id}
//                 className="flex gap-3 items-center p-5 cursor-pointer hover:bg-gray-100 rounded-lg w-[250px]"
//                 onClick={() => dispatch(setselectedUsers(mutualuser))}
//               >
//                 <Avatar>
//                   <AvatarImage src={mutualuser?.profilePicture} />
//                   <AvatarFallback>CN</AvatarFallback>
//                 </Avatar>
//                 <div className="flex flex-col">
//                   <span className="font-medium">{mutualuser?.username}</span>
//                   <span
//                     className={`text-xs font-bold ${
//                       isOnline ? "text-green-600" : "text-red-600"
//                     }`}
//                   >
//                     {isOnline ? "Online" : "Offline"}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </section>
//       {selectedUsers ? (
//         <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full justify-between">
//           <div className="flex items-center gap-2 mx-4 my-4  border-b border-gray-300 sticky top-0 bg-white z-10">
//             <Avatar>
//               <AvatarImage src={selectedUsers.profilePicture} />
//               <AvatarFallback>Cn</AvatarFallback>
//             </Avatar>
//             <div className="flex flex-col">{selectedUsers.username}</div>
//           </div>

//           <Messages selectedUsers={selectedUsers} />
//           <div className="flex items-center p-4 border-t border-t-gray-300">
//             <input
//               value={TextMsg}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && TextMsg.trim()) {
//                   sendMessageHandler(selectedUsers?._id);
//                 }
//               }}
//               onChange={(e) => setTextMsg(e.target.value)}
//               type="text"
//               className="flex-1 mr-2 bg-gray-100 p-2"
//               placeholder="Messages"
//             />
//             <Button onClick={() => sendMessageHandler(selectedUsers?._id)}>
//               Send
//             </Button>
//           </div>
//         </section>
//       ) : (
//         <div className="flex flex-col items-center justify-center mx-auto ">
//           <MessageCircleCode className="w-32 h-32 my-4" />
//           <h1 className="font-bold text-xl">Your Messages</h1>
//           <span>send a message to start a chat</span>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Conversation;
// No significant logic issue here, just cleaned up useEffect and handlers

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setselectedUsers } from "../ReduxStore/authSlice.js";
import { Button } from "@/components/ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages.jsx";
import { setMessages } from "../ReduxStore/ChatSlice.js";
import axios from "axios";
import { toast } from "react-toastify";

function Conversation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, selectedUsers } = useSelector((store) => store.auth);
  const { messages, onlineUsers } = useSelector((store) => store.chat);
  const [mutualFollowers, setMutualFollowers] = useState([]);
  const [TextMsg, setTextMsg] = useState("");

  useEffect(() => {
    if (!user) navigate("/signin");
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      const followingSet = new Set(user.following.map((f) => String(f._id)));
      const mutuals = user.followers.filter((f) =>
        followingSet.has(String(f._id))
      );
      setMutualFollowers(mutuals);
    }
  }, [user]);

  useEffect(() => {
    return () => dispatch(setselectedUsers(null));
  }, [dispatch]);

  const sendMessageHandler = async (ReceiverId) => {
    try {
      const res = await axios.post(
        `http://localhost:7464/user/message/send/${ReceiverId}`,
        { text: TextMsg },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMsg("");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex ml-[16%] h-screen">
      <section>
        <h1 className="font-bold mb-4 px-3 text-xl mt-6">{user?.username}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh] px-2">
          <h1 className="font-bold mb-4 px-3 text-xl mt-6">Messages</h1>
          {mutualFollowers.map((mutualuser) => {
            const isOnline = onlineUsers.includes(mutualuser._id);
            return (
              <div
                key={mutualuser._id}
                className="flex gap-3 items-center p-5 cursor-pointer hover:bg-gray-100 rounded-lg w-[250px]"
                onClick={() => dispatch(setselectedUsers(mutualuser))}
              >
                <Avatar>
                  <AvatarImage src={mutualuser.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{mutualuser.username}</span>
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
        </div>
      </section>

      {selectedUsers ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full justify-between">
          <div className="flex items-center gap-2 mx-4 my-4 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage src={selectedUsers.profilePicture} />
              <AvatarFallback>Cn</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">{selectedUsers.username}</div>
          </div>

          <Messages selectedUsers={selectedUsers} />
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <input
              value={TextMsg}
              onKeyDown={(e) => {
                if (e.key === "Enter" && TextMsg.trim()) {
                  sendMessageHandler(selectedUsers._id);
                }
              }}
              onChange={(e) => setTextMsg(e.target.value)}
              type="text"
              className="flex-1 mr-2 bg-gray-100 p-2"
              placeholder="Messages"
            />
            <Button onClick={() => sendMessageHandler(selectedUsers._id)}>
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1 className="font-bold text-xl">Your Messages</h1>
          <span>Send a message to start a chat</span>
        </div>
      )}
    </div>
  );
}

export default Conversation;
