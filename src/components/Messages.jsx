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
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { CheckCheck, Check } from "lucide-react";
// import { BsFilePdf } from "react-icons/bs";
// import useGetRTMmessage from "../Hooks/useGetRTMmessage.jsx";

// /* --- helper --- */
// function formatTime(dateStr) {
//   return new Date(dateStr).toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// /* === MAIN COMPONENT === */
// function Messages({ selectedUsers }) {
//   /* ──────────────────────────── state ──────────────────────────── */
//   const { user } = useSelector((store) => store.auth);
//   const typingUser = useGetRTMmessage();

//   const LIMIT = 6; // how many per page
//   const [pages, setPages] = useState([]); // array of page arrays
//   const [skip, setSkip] = useState(0); // next skip value
//   const [hasMore, setHasMore] = useState(true);
//   const loadingRef = useRef(false);

//   /* ────────────────────────── refs ─────────────────────────────── */
//   const listRef = useRef(null); // scrollable div
//   const bottomRef = useRef(null); // sentinel to scroll‑into‑view
//   const prevScrollHeight = useRef(0); // for keeping position after prepend

//   /* ───────────────────────── fetch page ────────────────────────── */
//   const fetchPage = useCallback(async () => {
//     if (loadingRef.current || !hasMore) return;
//     loadingRef.current = true;

//     try {
//       const MainUri = import.meta.env.VITE_MainUri;
//       const { data } = await axios.get(
//         `${MainUri}/user/message/${selectedUsers?.conversationId}?limit=${LIMIT}&skip=${skip}`,
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );
//       const newMsgs = data?.messages || [];

//       /* reverse → oldest first (top)… newest last (bottom) */
//       newMsgs.reverse();

//       setPages((prev) => [newMsgs, ...prev]); // prepend
//       setSkip((prev) => prev + LIMIT);
//       if (newMsgs.length < LIMIT) setHasMore(false);
//     } catch (err) {
//       console.error("Unable to fetch messages:", err);
//     } finally {
//       loadingRef.current = false;
//     }
//   }, [selectedUsers?._id, skip, hasMore]);

//   /* ─────────── initial load (latest messages) ─────────── */
//   useEffect(() => {
//     // reset when conversation changes
//     setPages([]);
//     setSkip(0);
//     setHasMore(true);
//   }, [selectedUsers?._id]);

//   useEffect(() => {
//     fetchPage();
//   }, [fetchPage]);

//   /* ─────────────── scroll behaviour ─────────────── */
//   /* keep scroll at bottom when new real‑time msg arrives */
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [pages]);

//   /* detect scroll‑to‑top to load more */
//   const onScroll = () => {
//     const node = listRef.current;
//     if (!node || loadingRef.current || !hasMore) return;

//     if (node.scrollTop <= 0) {
//       prevScrollHeight.current = node.scrollHeight;
//       fetchPage();
//     }
//   };

//   /* after older page prepended, maintain position */
//   useEffect(() => {
//     if (!prevScrollHeight.current) return;
//     const node = listRef.current;
//     const diff = node.scrollHeight - prevScrollHeight.current;
//     node.scrollTop = diff;
//     prevScrollHeight.current = 0;
//   }, [pages]);

//   /* ─────────────── flatten pages for rendering ─────────────── */
//   const messages = pages.flat();

//   /* ───────────────────────── render ───────────────────────── */
//   return (
//     <div className="flex-1 overflow-hidden">
//       {/* header area */}
//       <div className="flex justify-center p-4">
//         <div className="flex flex-col items-center">
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

//       {/* messages list */}
//       <div
//         ref={listRef}
//         onScroll={onScroll}
//         className="flex flex-col gap-3 px-4 overflow-y-auto h-[calc(100vh-200px)]"
//         style={{ scrollBehavior: "smooth" }}
//       >
//         {hasMore && (
//           <div className="text-center text-sm text-gray-400">
//             {loadingRef.current ? "Loading…" : "Scroll up for older messages"}
//           </div>
//         )}

//         {messages.map((msg, index) => {
//           /* …………… your original bubble rendering logic kept intact …………… */
//           const isSender = msg.senderId === user._id;
//           const isFilePresent = Boolean(msg?.file);
//           const isTextPresent = Boolean(msg?.messages);
//           const isFirstMessageOfReceiverBlock =
//             !isSender &&
//             (index === 0 || messages[index - 1].senderId === user._id);

//           return (
//             <div
//               key={msg._id}
//               className={`flex ${
//                 isSender ? "justify-end" : "justify-start"
//               } gap-2`}
//             >
//               {/* avatar for receiver blocks */}
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

//               {/* bubble */}
//               <div className="flex flex-col items-start max-w-[80%]">
//                 <div
//                   className={`relative p-2 rounded-lg break-words ${
//                     isSender
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-200 text-black"
//                   }`}
//                 >
//                   {/* username label */}
//                   {isFirstMessageOfReceiverBlock && (
//                     <span className="text-sm font-semibold text-gray-600 mb-1">
//                       {selectedUsers?.username}
//                     </span>
//                   )}

//                   {/* file / image / video etc. */}
//                   {/* keep your original file‑rendering helpers here */}

//                   {isTextPresent && <span>{msg.messages}</span>}

//                   <div className="flex justify-end items-center gap-1 text-xs mt-1">
//                     <span>{formatTime(msg.createdAt)}</span>
//                     {isSender && (
//                       <>
//                         {msg.status === "sent" && (
//                           <Check size={14} className="text-gray-300" />
//                         )}
//                         {(msg.status === "delivered" ||
//                           msg.status === "seen") && (
//                           <CheckCheck
//                             size={14}
//                             className={`transition-colors duration-300 ${
//                               msg.status === "seen"
//                                 ? "text-blue-300"
//                                 : "text-white"
//                             }`}
//                           />
//                         )}
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}

//         {/* typing indicator */}
//         {typingUser && (
//           <div className="flex justify-start gap-2">
//             {/* … your typing indicator JSX … */}
//           </div>
//         )}

//         <div ref={bottomRef} />
//       </div>
//     </div>
//   );
// }

// export default Messages;

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import axios from "axios";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { CheckCheck, Check } from "lucide-react";

// import useGetRTMmessage from "../Hooks/useGetRTMmessage.jsx";

// /* HH:MM helper */
// const formatTime = d =>
//   new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// export default function Messages({ selectedUsers }) {
//   /* ───── global data ───── */
//   const { user } = useSelector(s => s.auth);
//   const typingUser = useGetRTMmessage();

//   /* ───── pagination refs/state ───── */
//   const LIMIT = 6;

//   /** all message chunks; kept in a ref so their
//       update **itself** doesn't trigger re‑render loops */
//   const pagesRef = useRef([]);  // [[…6], […6], …]

//   /** dummy state – just “tick” to re‑render UI whenever pagesRef mutates */
//   const [tick, setTick] = useState(0);

//   /** “offset” for next fetch (ref, not state → no extra renders) */
//   const skipRef = useRef(0);

//   const hasMoreRef = useRef(true);   // more messages left?
//   const loadingRef = useRef(false);  // fetch in flight?

//   /* ───── DOM refs ───── */
//   const listRef          = useRef(null); // scrollable div
//   const bottomRef        = useRef(null); // sentinel at end
//   const prevScrollHeight = useRef(0);    // for scroll‑stay calc

//   /* ───────── fetch one page (older) ───────── */
//   const fetchPage = useCallback(async () => {
//     if (
//       loadingRef.current ||
//       !hasMoreRef.current ||
//       !selectedUsers?.conversationId
//     )
//       return;

//     loadingRef.current = true;

//     try {
//       const MainUri = import.meta.env.VITE_MainUri;
//       const { data } = await axios.get(
//         `${MainUri}/user/message/${selectedUsers.conversationId}?limit=${LIMIT}&skip=${skipRef.current}`,
//         { withCredentials: true }
//       );

//       /* backend returns newest→oldest; flip to oldest→newest */
//       const batch = (data.messages || []).reverse();

//       /* prepend batch */
//       pagesRef.current = [batch, ...pagesRef.current];
//       skipRef.current += LIMIT;

//       if (batch.length < LIMIT) hasMoreRef.current = false;

//       /** force re‑render */
//       setTick(t => t + 1);
//     } catch (e) {
//       console.error("Fetch error:", e);
//     } finally {
//       loadingRef.current = false;
//     }
//   }, [selectedUsers?.conversationId]);

//   /* ───── reset on conversation change ───── */
//   useEffect(() => {
//     pagesRef.current = [];
//     skipRef.current = 0;
//     hasMoreRef.current = true;
//     loadingRef.current = false;

//     /* first load: latest 6 */
//     fetchPage();
//   }, [selectedUsers?._id, fetchPage]);

//   /* ───── maintain scroll after older page prepend ───── */
//   useEffect(() => {
//     const box = listRef.current;
//     if (!box) return;

//     /* if we stored scrollHeight before a prepend, restore position */
//     if (prevScrollHeight.current) {
//       const diff = box.scrollHeight - prevScrollHeight.current;
//       box.scrollTop = diff;
//       prevScrollHeight.current = 0;          // reset flag
//     } else {
//       /* first load or realtime new → keep bottom‑aligned */
//       bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [tick]);

//   /* ───── scroll handler: load older when near top ───── */
//   const onScroll = () => {
//     const box = listRef.current;
//     if (!box || loadingRef.current || !hasMoreRef.current) return;

//     /* user reached very top? */
//     if (box.scrollTop <= 50) {
//       prevScrollHeight.current = box.scrollHeight; // capture BEFORE prepend
//       fetchPage();
//     }
//   };

//   /* ───── flatten all pages for rendering ───── */
//   const messages = pagesRef.current.flat();

//   /* ───── JSX ───── */
//   return (
//     <div className="flex-1 overflow-hidden">
//       {/* header */}
//       <div className="flex justify-center p-4">
//         <div className="flex flex-col items-center">
//           <Avatar className="h-20 w-20">
//             <AvatarImage src={selectedUsers?.profilePicture} />
//             <AvatarFallback>U</AvatarFallback>
//           </Avatar>
//           <span>{selectedUsers?.username}</span>
//           <Link to={`/profile/${selectedUsers?._id}`}>
//             <Button variant="secondary" className="h-8 my-2">
//               View Profile
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* messages list */}
//       <div
//         ref={listRef}
//         onScroll={onScroll}
//         className="flex flex-col gap-3 px-4 overflow-y-auto h-[calc(100vh-200px)]"
//       >
//         {hasMoreRef.current && (
//           <div className="text-center text-sm text-gray-400 mb-1">
//             {loadingRef.current ? "Loading…" : "ऊपर स्क्रोल करें"}
//           </div>
//         )}

//         {messages.map((m, i) => {
//           const sender = m.senderId === user._id;
//           const firstOfReceiver =
//             !sender && (i === 0 || messages[i - 1].senderId === user._id);

//           return (
//             <div
//               key={m._id}
//               className={`flex ${sender ? "justify-end" : "justify-start"} gap-2`}
//             >
//               {/* avatar only once per receiver block */}
//               {!sender && firstOfReceiver && (
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
//               {!sender && !firstOfReceiver && <div className="w-8 h-8" />}

//               {/* bubble */}
//               <div className="flex flex-col items-start max-w-[80%]">
//                 <div
//                   className={`p-2 rounded-lg break-words ${
//                     sender ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
//                   }`}
//                 >
//                   {firstOfReceiver && (
//                     <span className="text-sm font-semibold text-gray-600 mb-1">
//                       {selectedUsers?.username}
//                     </span>
//                   )}

//                   {m.messages && <span>{m.messages}</span>}

//                   <div className="flex justify-end items-center gap-1 text-xs mt-1">
//                     <span>{formatTime(m.createdAt)}</span>
//                     {sender && (
//                       <>
//                         {m.status === "sent" && (
//                           <Check size={14} className="text-gray-300" />
//                         )}
//                         {(m.status === "delivered" || m.status === "seen") && (
//                           <CheckCheck
//                             size={14}
//                             className={
//                               m.status === "seen" ? "text-blue-300" : "text-white"
//                             }
//                           />
//                         )}
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}

//         {/* typing indicator */}
//         {typingUser && (
//           <div className="flex justify-start gap-2">
//             <span className="text-sm italic text-gray-500">Typing…</span>
//           </div>
//         )}

//         <div ref={bottomRef} /> {/* sentinel at end */}
//       </div>
//     </div>
//   );
// }

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  Fragment,
} from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckCheck, Check } from "lucide-react";
import { BsFilePdf } from "react-icons/bs";

import useGetRTMmessage from "../Hooks/useGetRTMmessage.jsx";

/* helpers */
const formatTime = (d) =>
  new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/* ────────────────────────── component ────────────────────────── */
export default function Messages({ selectedUsers }) {
  /* global data */
  const { user } = useSelector((s) => s.auth);
  const typingUser = useGetRTMmessage();

  /* pagination refs / state */
  const LIMIT = 6;
  const pagesRef = useRef([]); // [[…6], […6], …] – oldest → newest inside each
  const skipRef = useRef(0);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);

  /* UI state */
  const [tick, setTick] = useState(0); // dummy to trigger re‑render
  const [openImage, setOpenImage] = useState(null);
  const [openVideo, setOpenVideo] = useState(null);

  /* DOM refs */
  const listRef = useRef(null);
  const bottomRef = useRef(null);
  const prevScrollHeight = useRef(0);

  /* ───── fetch one page (older) ───── */
  const fetchPage = useCallback(async () => {
    if (
      loadingRef.current ||
      !hasMoreRef.current ||
      !selectedUsers?.conversationId
    )
      return;

    loadingRef.current = true;

    try {
      const MainUri = import.meta.env.VITE_MainUri;
      const { data } = await axios.get(
        `${MainUri}/user/message/${selectedUsers.conversationId}?limit=${LIMIT}&skip=${skipRef.current}`,
        { withCredentials: true }
      );

      const batch = (data.messages || []).reverse(); // oldest→newest
      pagesRef.current = [batch, ...pagesRef.current]; // prepend
      skipRef.current += LIMIT;
      if (batch.length < LIMIT) hasMoreRef.current = false;
      setTick((t) => t + 1); // re‑render
    } catch (err) {
      console.error("fetchPage error:", err);
    } finally {
      loadingRef.current = false;
    }
  }, [selectedUsers?.conversationId]);

  /* reset when conversation changes */
  useEffect(() => {
    pagesRef.current = [];
    skipRef.current = 0;
    hasMoreRef.current = true;
    loadingRef.current = false;
    fetchPage(); // load latest‑6
  }, [selectedUsers?._id, fetchPage]);

  /* keep bottom on first load, keep position after prepend */
  useEffect(() => {
    const box = listRef.current;
    if (!box) return;

    if (prevScrollHeight.current) {
      const diff = box.scrollHeight - prevScrollHeight.current;
      box.scrollTop = diff;
      prevScrollHeight.current = 0;
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [tick]);

  /* scroll handler: load older on top */
  const onScroll = () => {
    const box = listRef.current;
    if (!box || loadingRef.current || !hasMoreRef.current) return;
    if (box.scrollTop <= 50) {
      prevScrollHeight.current = box.scrollHeight;
      fetchPage();
    }
  };

  const messages = pagesRef.current.flat(); // single chronological array

  /* ───────── helpers for file rendering ───────── */
  const renderAttachment = (msg) => {
    if (!msg.file) return null;

    const { url = "", filename = "file", mimetype = "", size = 0 } = msg.file;
    const ext =
      filename.split(".").pop()?.toLowerCase() ||
      mimetype.split("/").pop()?.toLowerCase();

    const fmtSize = (b) => {
      if (!b) return "0 KB";
      const k = 1024,
        sizes = ["Bytes", "KB", "MB", "GB"],
        i = Math.floor(Math.log(b) / Math.log(k));
      return `${(b / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
    };

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
      return (
        <Fragment>
          <img
            src={url}
            onClick={() => setOpenImage(url)}
            alt="attachment"
            className="w-full h-auto max-h-72 rounded-lg object-cover cursor-pointer"
          />
          {openImage === url && (
            <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
              <img
                src={url}
                alt="full"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setOpenImage(null)}
                className="absolute top-4 right-4 text-white text-4xl font-bold"
              >
                &times;
              </button>
            </div>
          )}
        </Fragment>
      );

    if (ext === "pdf")
      return (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-white p-2 rounded-md shadow-md cursor-pointer text-xs mt-1"
        >
          <BsFilePdf size={32} className="text-red-600" />
          <div className="flex flex-col">
            <span className="font-medium text-sm truncate max-w-[200px]">
              {filename}
            </span>
            <span className="text-xs text-gray-500">
              PDF · {fmtSize(size)}
            </span>
            View PDF
          </div>
        </a>
      );

    if (["mp4", "webm", "ogg"].includes(ext))
      return (
        <Fragment>
          <video
            controls
            src={url}
            className="w-full max-h-72 rounded-lg pointer-events-auto"
            onClick={(e) => {
              /* prevent accidental modal */
              e.stopPropagation();
            }}
          />
          {openVideo === url && (
            <div
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
              onClick={() => setOpenVideo(null)}
            >
              <video
                controls
                autoPlay
                src={url}
                className="max-w-full max-h-full rounded-lg"
              />
            </div>
          )}
        </Fragment>
      );

    /* fallback */
    return (
      <div className="flex flex-col items-start">
        <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
          {filename}
        </a>
        <span className="text-xs text-gray-500 mt-1">{fmtSize(size)}</span>
      </div>
    );
  };

  /* ───────── JSX ───────── */
  return (
    <div className="flex-1 overflow-hidden">
      {/* header */}
      <div className="flex justify-center p-4">
        <div className="flex flex-col items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedUsers?.profilePicture} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span>{selectedUsers?.username}</span>
          <Link to={`/profile/${selectedUsers?._id}`}>
            <Button variant="secondary" className="h-8 my-2">
              View Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* message list */}
      <div
        ref={listRef}
        onScroll={onScroll}
        className="flex flex-col gap-3 px-4 overflow-y-auto h-[calc(100vh-200px)]"
      >
        {hasMoreRef.current && (
          <div className="text-center text-sm text-gray-400 mb-1">
            {loadingRef.current ? "Loading…" : "Scroll up for older messages"}
          </div>
        )}

        {messages.map((m, i) => {
          const sender = m.senderId === user._id;
          const firstOfReceiver =
            !sender && (i === 0 || messages[i - 1].senderId === user._id);

          return (
            <div
              key={m._id}
              className={`flex ${sender ? "justify-end" : "justify-start"} gap-2`}
            >
              {/* receiver avatar once per block */}
              {!sender && firstOfReceiver && (
                <Avatar className="w-8 h-8 self-start">
                  <Link to={`/profile/${selectedUsers?._id}`}>
                    <AvatarImage
                      src={selectedUsers?.profilePicture}
                      className="cursor-pointer"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Link>
                </Avatar>
              )}
              {!sender && !firstOfReceiver && <div className="w-8 h-8" />}

              <div className="flex flex-col items-start max-w-[80%]">
                <div
                  className={`p-2 rounded-lg break-words ${
                    sender ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  {firstOfReceiver && (
                    <span className="text-sm font-semibold text-gray-600 mb-1">
                      {selectedUsers?.username}
                    </span>
                  )}

                  {/* attachment / text */}
                  {renderAttachment(m)}
                  {m.messages && <span>{m.messages}</span>}

                  {/* meta row */}
                  <div className="flex justify-end items-center gap-1 text-xs mt-1">
                    <span>{formatTime(m.createdAt)}</span>
                    {sender && (
                      <>
                        {m.status === "sent" && (
                          <Check size={14} className="text-gray-300" />
                        )}
                        {(m.status === "delivered" || m.status === "seen") && (
                          <CheckCheck
                            size={14}
                            className={
                              m.status === "seen" ? "text-blue-300" : "text-white"
                            }
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* typing indicator */}
        {typingUser && (
          <div className="flex justify-start gap-2">
            <Avatar className="w-8 h-8 self-start">
              <AvatarImage src={selectedUsers?.profilePicture} />
              <AvatarFallback>{selectedUsers?.username?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start max-w-[80%]">
              <div className="bg-gray-200 text-black p-2 rounded-lg">
                <span className="text-sm font-semibold text-gray-600">
                  {selectedUsers?.username}
                </span>
                <span className="flex gap-1 mt-1">
                  <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-150" />
                  <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-300" />
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
