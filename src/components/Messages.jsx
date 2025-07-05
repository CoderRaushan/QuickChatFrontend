// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import GetAllMessages from "../Hooks/useGetAllMessages.jsx";
// import useGetRTMmessage from "../Hooks/useGetRTMmessage.jsx";
// import { CheckCheck, Check } from "lucide-react";
// import React, { useEffect, useRef, useState } from "react";
// import { BsFilePdf } from "react-icons/bs";

// function formatTime(dateStr) {
//   const date = new Date(dateStr);
//   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// }

// function Messages({ selectedUsers }) {
//   const typingUser = useGetRTMmessage();
//   GetAllMessages();
//   const { messages } = useSelector((store) => store.chat);
//   const { user } = useSelector((store) => store.auth);
//   const messagesEndRef = useRef(null);
//   const [openImage, setOpenImage] = useState(null);
//   const [openVideo, setopenVideo] = useState(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const filteredMessages = messages?.filter(
//       (msg) =>
//       (msg?.senderId === user?._id && msg?.receiverId === selectedUsers?._id) ||
//       (msg?.senderId === selectedUsers?._id && msg?.receiverId === user?._id)
//   );
//   return (
//     <div className="overflow-y-auto flex-1 p-4 pb-16">
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
//         {filteredMessages?.map((msg, index) => {
//           const isSender = msg.senderId === user._id;
//           const isFilePresent = Boolean(msg?.file);
//           const isTextPresent = Boolean(msg?.messages);
//           const isFirstMessageOfReceiverBlock =
//             !isSender &&
//             (index === 0 || filteredMessages[index - 1].senderId === user._id);

//           return (
//             <div
//               key={msg._id}
//               className={`flex ${
//                 isSender ? "justify-end" : "justify-start"
//               } gap-2`}
//             >
//               {!isSender && isFirstMessageOfReceiverBlock && (
//                 <Avatar className="w-8 h-8 self-start">
//                   <Link to={`/profile/${selectedUsers?._id}`}>
//                     <AvatarImage
//                       src={selectedUsers?.profilePicture}
//                       className="cursor-pointer"
//                     />
//                     <AvatarFallback>U</AvatarFallback>
//                   </Link>
//                 </Avatar>
//               )}
//               {!isSender && !isFirstMessageOfReceiverBlock && (
//                 <div className="w-8 h-8" />
//               )}

//               <div className="flex flex-col items-start max-w-[80%]">
//                 <div
//                   className={`relative p-2 rounded-lg break-words ${
//                     isSender
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-200 text-black"
//                   }`}
//                 >
//                   <div className="flex flex-col gap-2">
//                     {isFirstMessageOfReceiverBlock && (
//                       <span className="text-sm font-semibold text-gray-600 mb-1">
//                         {selectedUsers?.username}
//                       </span>
//                     )}

//                     {isFilePresent &&
//                       (() => {
//                         const fileUrl = String(msg?.file?.url || "");
//                         const fileName = msg?.file?.filename || "Unknown File";
//                         const mimeType = msg?.file?.mimetype || "";
//                         const fileSizeBytes = msg?.file?.size || 0;

//                         const fileExtension =
//                           fileName.split(".").pop()?.toLowerCase() ||
//                           mimeType.split("/").pop()?.toLowerCase() ||
//                           "";

//                         const formatSize = (bytes) => {
//                           if (bytes === 0) return "0 KB";
//                           const k = 1024;
//                           const dm = 1;
//                           const sizes = ["Bytes", "KB", "MB", "GB"];
//                           const i = Math.floor(Math.log(bytes) / Math.log(k));
//                           return (
//                             parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) +
//                             " " +
//                             sizes[i]
//                           );
//                         };

//                         const readableSize = formatSize(fileSizeBytes);

//                         const renderPDF = () => (
//                           <a
//                             href={fileUrl}
//                             target="_blank"
//                             rel="noreferrer"
//                             className="text-xs mt-1"
//                           >
//                             <div className="flex items-center gap-2 bg-white p-2 rounded-md shadow-md cursor-pointer">
//                               <BsFilePdf size={32} className="text-red-600" />
//                               <div className="flex flex-col">
//                                 <span className="font-medium text-sm truncate max-w-[200px]">
//                                   {fileName}
//                                 </span>
//                                 <span className="text-xs text-gray-500">
//                                   PDF File · {readableSize}
//                                 </span>
//                                 View PDF
//                               </div>
//                             </div>
//                           </a>
//                         );

//                         const renderImage = () => (
//                           <div className="flex flex-col items-start">
//                             <img
//                               src={fileUrl}
//                               onClick={() => setOpenImage(fileUrl)}
//                               alt="attachment"
//                               className="w-full h-auto max-h-72 rounded-lg object-cover cursor-pointer"
//                             />
//                             {/* Fullscreen Modal */}
//                             {openImage && (
//                               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
//                                 <button
//                                   onClick={() => setOpenImage(null)}
//                                   className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-500"
//                                 >
//                                   &times;
//                                 </button>
//                                 <img
//                                   src={openImage}
//                                   alt="Full View"
//                                   className="max-w-screen max-h-screen object-contain rounded-lg"
//                                 />
//                               </div>
//                             )}
//                           </div>
//                         );

//                         const renderVideo = () => (
//                           <div className="flex flex-col items-start">
//                             <video
//                               controls
//                               src={fileUrl}
//                               className="w-full max-h-72 rounded-lg pointer-events-auto"
//                               onClick={(e) => {
//                                 // Prevent click on video body from triggering play or modal
//                                 // But allow native play button to work
//                                 const rect =
//                                   e.currentTarget.getBoundingClientRect();
//                                 const x = e.clientX - rect.left;
//                                 const y = e.clientY - rect.top;

//                                 // Approximate region for center play button
//                                 const centerX = rect.width / 2;
//                                 const centerY = rect.height / 2;
//                                 const radius = 40; // Adjust this to the play button size

//                                 const isPlayButtonClick =
//                                   Math.pow(x - centerX, 2) +
//                                     Math.pow(y - centerY, 2) <=
//                                   Math.pow(radius, 2);

//                                 if (!isPlayButtonClick) {
//                                   e.preventDefault();
//                                   e.stopPropagation();
//                                 }
//                               }}
//                             ></video>
//                             {/* Fullscreen Modal */}
//                             {openVideo === fileUrl && (
//                               <div
//                                 className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
//                                 onClick={() => setopenVideo(null)}
//                               >
//                                 <video
//                                   controls
//                                   autoPlay
//                                   src={fileUrl}
//                                   className="max-w-full max-h-full rounded-lg"
//                                 />
//                               </div>
//                             )}
//                           </div>
//                         );
//                         if (
//                           ["jpg", "jpeg", "png", "gif", "webp"].includes(
//                             fileExtension
//                           )
//                         )
//                           return renderImage();
//                         if (fileExtension === "pdf") return renderPDF();
//                         if (["mp4", "webm", "ogg"].includes(fileExtension))
//                           return renderVideo();
//                         return (
//                           <div className="flex flex-col items-start">
//                             <a
//                               href={fileUrl}
//                               target="_blank"
//                               rel="noreferrer"
//                               className="text-blue-600 underline"
//                             >
//                               {fileName}
//                             </a>
//                             <span className="text-xs text-gray-500 mt-1">
//                               {readableSize}
//                             </span>
//                           </div>
//                         );
//                       })()}

//                     {isTextPresent && <span>{msg.messages}</span>}

//                     <div className="flex justify-end items-center gap-1 text-xs mt-1">
//                       <span>{formatTime(msg.createdAt)}</span>
//                       {isSender && (
//                         <>
//                           {msg.status === "sent" && (
//                             <Check size={14} className="text-gray-300" />
//                           )}
//                           {(msg.status === "delivered" ||
//                             msg.status === "seen") && (
//                             <CheckCheck
//                               size={14}
//                               className={`transition-colors duration-300 ${
//                                 msg.status === "seen"
//                                   ? "text-blue-300"
//                                   : "text-white"
//                               }`}
//                             />
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}

//         {/* Typing Indicator */}
//         {typingUser && (
//           <div className="flex justify-start gap-2">
//             <Avatar className="w-8 h-8 self-start">
//               <AvatarImage src={selectedUsers?.profilePicture} />
//               <AvatarFallback>{selectedUsers?.username[0]}</AvatarFallback>
//             </Avatar>

//             <div className="flex flex-col items-start max-w-[80%]">
//               <div className="bg-gray-200 text-black p-2 rounded-lg">
//                 <div className="flex flex-col gap-1">
//                   <span className="text-sm font-semibold text-gray-600 mb-1">
//                     {selectedUsers?.username}
//                   </span>
//                   <div className="flex items-center gap-2">
//                     {/* <span className="italic text-gray-600">typing</span> */}
//                     <span className="flex gap-1 ml-1">
//                       <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></span>
//                       <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-150"></span>
//                       <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-300"></span>
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>
//     </div>
//   );
// }

// export default Messages;

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { Check, CheckCheck } from "lucide-react";
import { BsFilePdf } from "react-icons/bs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import throttle from "lodash.throttle";
import useGetRTMmessage from "../Hooks/useGetRTMmessage.jsx";
import { setMessages } from "../ReduxStore/ChatSlice.js";

/* ───────────────── helpers ───────────────── */
const LIMIT = 6;
const formatTime = (d) =>
  new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const dedupe = (arr) => {
  const seen = new Set();
  return arr.filter((m) => {
    if (seen.has(m._id)) return false;
    seen.add(m._id);
    return true;
  });
};

/* ───────────────── component ───────────────── */
function Messages({ selectedUsers }) {
  const dispatch = useDispatch();
  const { messages } = useSelector((s) => s.chat);
  const { user } = useSelector((s) => s.auth);

  /* refs */
  const containerRef = useRef(null);
  const skipRef = useRef(0);
  const fetchingRef = useRef(false);

  /* local state */
  const [openImage, setOpenImage] = useState(null);
  const [openVideo, setOpenVideo] = useState(null);
  const [loadingTop, setLoadingTop] = useState(false);
  const [hasMore, setHasMore] = useState(true); // “No more messages” flag
  const typingUser = useGetRTMmessage();

  /* pick only msgs for this chat & sort oldest→newest */
  const chatMsgs = useMemo(() => {
    return messages
      .filter(
        (m) =>
          (m.senderId === user._id && m.receiverId === selectedUsers._id) ||
          (m.senderId === selectedUsers._id && m.receiverId === user._id)
      )
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [messages, selectedUsers, user]);

  /* reset counters whenever user changes chat */
  useEffect(() => {
    skipRef.current = chatMsgs.length;
    setHasMore(true);
  }, [selectedUsers, chatMsgs.length]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [chatMsgs]);
  /* fetch previous page */
  const loadMoreTop = useCallback(async () => {
    if (fetchingRef.current || !hasMore) return;
    fetchingRef.current = true;
    setLoadingTop(true);

    const container = containerRef.current;
    const oldHeight = container.scrollHeight;

    try {
      const MainUri = import.meta.env.VITE_MainUri;
      const { data } = await axios.get(
        `${MainUri}/user/message/${selectedUsers.conversationId}?limit=${LIMIT}&skip=${skipRef.current}`,
        { withCredentials: true }
      );

      const newMsgs = (data.messages || []).reverse(); // oldest→newest
      if (newMsgs.length === 0) {
        setHasMore(false); // reached beginning
      } else {
        skipRef.current += newMsgs.length;
        dispatch(setMessages(dedupe([...newMsgs, ...messages])));

        await new Promise((r) => requestAnimationFrame(r));
        container.scrollTop = container.scrollHeight - oldHeight;
      }
    } catch (err) {
      console.error("fetchPage error:", err);
    } finally {
      fetchingRef.current = false;
      setLoadingTop(false);
    }
  }, [dispatch, messages, selectedUsers, hasMore]);

  /* initial page if cache empty */
  useEffect(() => {
    if (chatMsgs.length === 0) loadMoreTop();
  }, [selectedUsers]);

  /* scroll listener */
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const throttledLoadMoreTop = throttle(() => {
      if (c.scrollTop < 5) {
        loadMoreTop();
      }
    },500); // adjust time in ms as needed

    c.addEventListener("scroll", throttledLoadMoreTop);
    return () => {
      c.removeEventListener("scroll", throttledLoadMoreTop);
      throttledLoadMoreTop.cancel(); // cleanup
    };
  }, [loadMoreTop]);

  /* scroll to bottom on first open */
  useEffect(() => {
    if (chatMsgs.length <= LIMIT) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [selectedUsers]);

  /* ───────────────── render ───────────────── */
  return (
    <div ref={containerRef} className="overflow-y-auto flex-1 p-4 pb-16">
      <Header user={selectedUsers} />

      <div className="flex flex-col gap-3 mt-4">
        {/* spinner / no-more messages banner */}
        {loadingTop && (
          <div className="flex justify-center py-1">
            <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
          </div>
        )}
        {!loadingTop && !hasMore && (
          <div className="text-center text-xs text-gray-500 py-1">
            No more messages
          </div>
        )}

        {/* actual messages */}
        {chatMsgs.map((m, i) => (
          <MessageBubble
            key={m._id}
            msg={m}
            idx={i}
            list={chatMsgs}
            selfId={user._id}
            other={selectedUsers}
            openImage={openImage}
            setOpenImage={setOpenImage}
            openVideo={openVideo}
            setOpenVideo={setOpenVideo}
          />
        ))}

        {typingUser && <TypingBubble user={selectedUsers} />}
      </div>
    </div>
  );
}

/* ───────────────── sub components ───────────────── */
const Header = ({ user }) => (
  <div className="flex justify-center">
    <div className="flex flex-col items-center">
      <Avatar className="h-20 w-20">
        <AvatarImage src={user.profilePicture} />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <span>{user.username}</span>
      <Link to={`/profile/${user._id}`}>
        <Button className="h-8 my-2" variant="secondary">
          View Profile
        </Button>
      </Link>
    </div>
  </div>
);

const FullScreen = ({ children, onClose }) => (
  <div
    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
    onClick={onClose}
  >
    {children}
  </div>
);

const MessageBubble = ({
  msg,
  idx,
  list,
  selfId,
  other,
  openImage,
  setOpenImage,
  openVideo,
  setOpenVideo,
}) => {
  const isSender = msg.senderId === selfId;
  const firstOfBlock =
    !isSender && (idx === 0 || list[idx - 1].senderId === selfId);

  /* attachment renderer */
  const renderAttachment = () => {
    if (!msg.file) return null;
    const { url = "", filename = "file", mimetype = "", size = 0 } = msg.file;
    const ext = (
      filename.split(".").pop() ||
      mimetype.split("/").pop() ||
      ""
    ).toLowerCase();
    const kb = size ? `${(size / 1024).toFixed(1)} KB` : "";

    const PDF = () => (
      <a href={url} target="_blank" rel="noreferrer" className="text-xs mt-1">
        <div className="flex items-center gap-2 bg-white p-2 rounded-md shadow">
          <BsFilePdf size={28} className="text-red-600" />
          <div className="flex flex-col">
            <span className="font-medium text-sm truncate max-w-[180px]">
              {filename}
            </span>
            <span className="text-xs text-gray-500">PDF · {kb}</span>
          </div>
        </div>
      </a>
    );

    const Image = () => (
      <>
        <img
          src={url}
          className="w-full max-h-72 rounded-lg cursor-pointer object-cover"
          onClick={() => setOpenImage(url)}
        />
        {openImage === url && (
          <FullScreen onClose={() => setOpenImage(null)}>
            <img src={url} className="max-w-full max-h-full" />
          </FullScreen>
        )}
      </>
    );

    const Video = () => (
      <>
        <video
          controls
          src={url}
          className="w-full max-h-72 rounded-lg"
          onClick={() => setOpenVideo(url)}
        />
        {openVideo === url && (
          <FullScreen onClose={() => setOpenVideo(null)}>
            <video
              controls
              autoPlay
              src={url}
              className="max-w-full max-h-full"
            />
          </FullScreen>
        )}
      </>
    );

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return <Image />;
    if (ext === "pdf") return <PDF />;
    if (["mp4", "webm", "ogg"].includes(ext)) return <Video />;

    return (
      <div className="flex flex-col">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline"
        >
          {filename}
        </a>
        <span className="text-xs text-gray-500">{kb}</span>
      </div>
    );
  };

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} gap-2`}>
      {!isSender &&
        (firstOfBlock ? (
          <Avatar className="w-8 h-8 self-start">
            <Link to={`/profile/${other._id}`}>
              <AvatarImage
                src={other.profilePicture}
                className="cursor-pointer"
              />
              <AvatarFallback>U</AvatarFallback>
            </Link>
          </Avatar>
        ) : (
          <div className="w-8 h-8" />
        ))}

      <div className="flex flex-col items-start max-w-[80%]">
        <div
          className={`p-2 rounded-lg break-words ${
            isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
        >
          <div className="flex flex-col gap-2">
            {firstOfBlock && !isSender && (
              <span className="text-sm font-semibold text-gray-600 -mt-0.5">
                {other.username}
              </span>
            )}

            {renderAttachment()}
            {msg.messages && <span>{msg.messages}</span>}

            <div className="flex justify-end gap-1 text-xs mt-1 items-center">
              <span>{formatTime(msg.createdAt)}</span>
              {isSender &&
                (msg.status === "sent" ? (
                  <Check size={14} className="text-gray-300" />
                ) : (
                  <CheckCheck
                    size={14}
                    className={
                      msg.status === "seen" ? "text-green-400" : "text-gray-300"
                    }
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* simple typing indicator */
const TypingBubble = ({ user }) => (
  <div className="flex justify-start gap-2 pl-4">
    <Avatar className="w-8 h-8 self-start">
      <AvatarImage src={user?.profilePicture} />
      <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
    </Avatar>

    <div className="flex flex-col items-start max-w-[80%]">
      <div className="bg-gray-200 text-black p-2 rounded-lg">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-gray-600 mb-1">
            {user?.username}
          </span>
          <div className="flex items-center gap-2">
            <span className="flex gap-1 ml-1">
              <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-300"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Messages;
