// import React, { useEffect, useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Dialog,
//   DialogContent,
//   DialogTrigger,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Link } from "react-router-dom";
// import { MoreHorizontal } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useDispatch, useSelector } from "react-redux";
// import Comment from "./Comment.jsx";
// import axios from "axios";
// import { setPosts } from "../ReduxStore/PostSlice.js";
// import { toast } from "react-toastify";
// function CommentDialog({ CommentOpen, setCommentOpen }) {
//   const [commentText, setcommentText] = useState("");
//   const { SelectedPost } = useSelector((store) => store.post);
//   const { user } = useSelector((store) => store.auth);
//   const Posts = useSelector((store) => store.post);
//   const dispatch = useDispatch();
//   const [CommentData, setCommentData] = useState([]);
//   useEffect(() => {
//     setCommentData(SelectedPost?.comments);
//   }, [SelectedPost]);

//   const changeEventHandler = (e) => {
//     setcommentText(e.target.value);
//   };
//   const SendCommentHandler = async () => {
//     try {
//       const MainUri = import.meta.env.VITE_MainUri;
//       const response = await axios.post(
//         `${MainUri}/user/post/${SelectedPost._id}/comment`,
//         { text: commentText },
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );
//       if (response.data.success) {
//         setCommentData([...CommentData, response.data.comment]);
//         setcommentText("");
//         const updatedpost = Posts.post.map((p) =>
//           p._id === SelectedPost._id
//             ? {
//                 ...p,
//                 comments: [...p.comments, response.data.comment],
//               }
//             : p
//         );
//         dispatch(setPosts(updatedpost));
//         toast.success(response.data.message || "Comment Added!");
//       }
//     } catch (error) {
//       toast.error(error.response.data.message || "Internal Server Error");
//     }
//   };
//   return (
//     <Dialog open={CommentOpen}>
//       <DialogContent
//         onInteractOutside={() => setCommentOpen(false)}
//         className="max-w-5xl p-0 flex flex-col"
//       >
//         {/* Add DialogTitle for accessibility */}
//         <DialogTitle className="sr-only">Comments</DialogTitle>
//         <DialogDescription className="sr-only">
//           View and post comments on this post.
//         </DialogDescription>
//         <div className="flex flex-1">
//           <div className="w-1/2">
//             {(() => {
//               const fileUrl = SelectedPost?.file?.url || "";
//               const fileType = SelectedPost?.file?.mimetype || "";

//               const isVideo =
//                 fileType.startsWith("video/") ||
//                 /\.(mp4|webm|ogg)$/i.test(fileUrl);

//               const isPDF =
//                 fileType === "application/pdf" || fileUrl.endsWith(".pdf");

//               const isAudio =
//                 fileType.startsWith("audio/") ||
//                 /\.(mp3|wav|aac|flac|opus)$/i.test(fileUrl);

//               const isDocument =
//                 /(msword|vnd.openxmlformats-officedocument.wordprocessingml.document)/.test(
//                   fileType
//                 ) || /\.(doc|docx|odt|rtf|txt)$/i.test(fileUrl);

//               if (isVideo) {
//                 return (
//                   <div className="my-4 rounded-lg overflow-hidden shadow-md">
//                     <video
//                       src={fileUrl}
//                       controls
//                       className="w-full h-72 object-contain bg-black rounded-lg"
//                     >
//                       Your browser does not support the video tag.
//                     </video>
//                   </div>
//                 );
//               }
//               if (isDocument) {
//                 return (
//                   <div className="my-4">
//                     <iframe
//                       src={`https://docs.google.com/gview?url=${encodeURIComponent(
//                         fileUrl
//                       )}&embedded=true`}
//                       className="w-full h-72 rounded-md"
//                       title="Document Viewer"
//                       frameBorder="0"
//                       onError={(e) => {
//                         e.target.style.display = "none";
//                       }}
//                     />
//                     <p className="mt-2 text-sm text-gray-600">
//                       Can't preview this document?{" "}
//                       <a
//                         href={fileUrl}
//                         download
//                         className="text-blue-600 underline"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         Download here
//                       </a>
//                     </p>
//                   </div>
//                 );
//               }

//               if (isPDF) {
//                 return (
//                   <iframe
//                     src={fileUrl}
//                     className="w-full h-72 rounded-lg"
//                     title="PDF Viewer"
//                   />
//                 );
//               }

//               if (isAudio) {
//                 return (
//                   <div className="my-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md flex items-center space-x-4">
//                     <i className="fa-solid fa-music text-2xl text-blue-600 dark:text-blue-400"></i>
//                     <audio
//                       src={fileUrl}
//                       controls
//                       className="w-full focus:outline-none"
//                     >
//                       Your browser does not support the audio element.
//                     </audio>
//                   </div>
//                 );
//               }

//               if (isDocument) {
//                 return (
//                   <iframe
//                     src={`https://docs.google.com/gview?url=${encodeURIComponent(
//                       fileUrl
//                     )}&embedded=true`}
//                     className="w-full h-72 rounded-md"
//                     title="Document Viewer"
//                   />
//                 );
//               }

//               // Default fallback for images
//               return (
//                 <img
//                   src={fileUrl}
//                   alt="Post"
//                   className="w-full h-full object-cover aspect-square rounded-sm"
//                 />
//               );
//             })()}
//           </div>
//           <div className="w-1/2 flex flex-col justify-between">
//             <div className="flex items-center justify-between p-4">
//               <div className="flex gap-3 items-center">
//                 <Link>
//                   <Avatar>
//                     <AvatarImage src={SelectedPost?.author?.profilePicture} />
//                     <AvatarFallback>cn</AvatarFallback>
//                   </Avatar>
//                 </Link>
//                 <div className="flex flex-col">
//                   <Link className="font-semibold text-base">
//                     {SelectedPost?.author?.username || "username"}
//                   </Link>
//                 </div>
//               </div>
//               <Dialog>
//                 <DialogTrigger asChild>
//                   <MoreHorizontal className="cursor-pointer" />
//                 </DialogTrigger>
//                 <DialogContent className="flex flex-col items-center text-sm text-center">
//                   <div className="cursor-pointer w-full text-[#ED4956] font-bold">
//                     {user?._id !== SelectedPost?.author?._id && "Unfollow"}
//                   </div>
//                   <div className="cursor-pointer w-full">Add to favorites</div>
//                 </DialogContent>
//               </Dialog>
//             </div>
//             <hr />
//             <div className="flex-1 overflow-y-auto max-h-96 p-4">
//               <div className="flex gap-3 items-center">
//                 <Link>
//                   <Avatar>
//                     <AvatarImage src={SelectedPost?.author?.profilePicture} />
//                     <AvatarFallback>cn</AvatarFallback>
//                   </Avatar>
//                 </Link>
//                 <div className="flex flex-col">
//                   <Link className="font-semibold text-base">
//                     {SelectedPost?.author?.username || "username"}
//                   </Link>
//                   <span className="text-sm">{SelectedPost?.caption}</span>
//                 </div>
//               </div>
//               {CommentData?.map((comment) => {
//                 return <Comment key={comment._id} comment={comment} />;
//               })}
//             </div>
//             <div className="p-4">
//               <div className="flex items-center gap-2">
//                 <input
//                   type="text"
//                   onChange={changeEventHandler}
//                   placeholder="Add a comment...."
//                   className="w-full outline-none border border-gray-300 p-2 rounded"
//                 />
//                 <Button
//                   disabled={!commentText}
//                   onClick={SendCommentHandler}
//                   variant="outline"
//                 >
//                   Post
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default CommentDialog;
//final code
// import React, { useEffect, useState, useRef } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Dialog,
//   DialogContent,
//   DialogTrigger,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Link } from "react-router-dom";
// import { MoreHorizontal, Volume2, VolumeX } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useDispatch, useSelector } from "react-redux";
// import Comment from "./Comment.jsx";
// import axios from "axios";
// import { setPosts } from "../ReduxStore/PostSlice.js";
// import { toast } from "react-toastify";

// function CommentDialog({ CommentOpen, setCommentOpen }) {
//   const [commentText, setcommentText] = useState("");
//   const { SelectedPost } = useSelector((store) => store.post);
//   const { user } = useSelector((store) => store.auth);
//   const Posts = useSelector((store) => store.post);
//   const dispatch = useDispatch();
//   const [CommentData, setCommentData] = useState([]);
//   const [isMuted, setIsMuted] = useState(true);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     setCommentData(SelectedPost?.comments);
//   }, [SelectedPost]);

//   const toggleMute = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !videoRef.current.muted;
//       setIsMuted(videoRef.current.muted);
//     }
//   };

//   const changeEventHandler = (e) => {
//     setcommentText(e.target.value);
//   };

//   const SendCommentHandler = async () => {
//     try {
//       const MainUri = import.meta.env.VITE_MainUri;
//       const response = await axios.post(
//         `${MainUri}/user/post/${SelectedPost._id}/comment`,
//         { text: commentText },
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );
//       if (response.data.success) {
//         setCommentData([...CommentData, response.data.comment]);
//         setcommentText("");
//         const updatedpost = Posts.post.map((p) =>
//           p._id === SelectedPost._id
//             ? { ...p, comments: [...p.comments, response.data.comment] }
//             : p
//         );
//         dispatch(setPosts(updatedpost));
//         toast.success(response.data.message || "Comment Added!");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Internal Server Error");
//     }
//   };

//   return (
//     <Dialog open={CommentOpen}>
//       <DialogContent
//         onInteractOutside={() => setCommentOpen(false)}
//         className="max-w-5xl p-0 flex flex-col"
//       >
//         <DialogTitle className="sr-only">Comments</DialogTitle>
//         <DialogDescription className="sr-only">
//           View and post comments on this post.
//         </DialogDescription>
//         <div className="flex flex-1">
//           {/* Left Side - Media */}
//           <div className="w-1/2 bg-black relative">
//             {(() => {
//               const fileUrl = SelectedPost?.file?.url || "";
//               const fileType = SelectedPost?.file?.mimetype || "";

//               const isVideo =
//                 fileType.startsWith("video/") ||
//                 /\.(mp4|webm|ogg)$/i.test(fileUrl);

//               if (isVideo) {
//                 return (
//                   <div
//                     className="relative aspect-[11/16] w-full cursor-pointer"
//                     onClick={() => {
//                       if (videoRef.current) {
//                         if (videoRef.current.paused) {
//                           videoRef.current.play();
//                         } else {
//                           videoRef.current.pause();
//                         }
//                       }
//                     }}
//                   >
//                     <video
//                       ref={videoRef}
//                       src={fileUrl}
//                       autoPlay
//                       loop
//                       playsInline
//                       className="w-full h-full object-cover rounded-md"
//                     />
//                     {/* Mute/Unmute Button */}
//                     <button
//                       onClick={toggleMute}
//                       className="absolute bottom-3 right-3 bg-black/60 p-2 rounded-full text-white"
//                     >
//                       {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
//                     </button>
//                   </div>
//                 );
//               }

//               // Image fallback
//               return (
//                 <img
//                   src={fileUrl}
//                   alt="Post"
//                   className="w-full h-full object-cover aspect-square rounded-sm"
//                 />
//               );
//             })()}
//           </div>

//           {/* Right Side - Comments and Info */}
//           <div className="w-1/2 flex flex-col justify-between">
//             <div className="flex items-center justify-between p-4">
//               <div className="flex gap-3 items-center">
//                 <Link>
//                   <Avatar>
//                     <AvatarImage src={SelectedPost?.author?.profilePicture} />
//                     <AvatarFallback>cn</AvatarFallback>
//                   </Avatar>
//                 </Link>
//                 <div className="flex flex-col">
//                   <Link className="font-semibold text-base">
//                     {SelectedPost?.author?.username || "username"}
//                   </Link>
//                 </div>
//               </div>
//               <Dialog>
//                 <DialogTrigger asChild>
//                   <MoreHorizontal className="cursor-pointer" />
//                 </DialogTrigger>
//                 <DialogContent className="flex flex-col items-center text-sm text-center">
//                   <div className="cursor-pointer w-full text-[#ED4956] font-bold">
//                     {user?._id !== SelectedPost?.author?._id && "Unfollow"}
//                   </div>
//                   <div className="cursor-pointer w-full">Add to favorites</div>
//                 </DialogContent>
//               </Dialog>
//             </div>
//             <hr />
//             <div className="flex-1 overflow-y-auto p-4">
//               <div className="flex gap-3 items-center mb-2">
//                 <Link>
//                   <Avatar>
//                     <AvatarImage src={SelectedPost?.author?.profilePicture} />
//                     <AvatarFallback>cn</AvatarFallback>
//                   </Avatar>
//                 </Link>
//                 <div className="flex flex-col">
//                   <Link className="font-semibold text-base">
//                     {SelectedPost?.author?.username || "username"}
//                   </Link>
//                   <span className="text-sm">{SelectedPost?.caption}</span>
//                 </div>
//               </div>
//               {CommentData?.map((comment) => (
//                 <Comment key={comment._id} comment={comment} />
//               ))}
//             </div>
//             <div className="p-4">
//               <div className="flex items-center gap-2">
//                 <input
//                   type="text"
//                   onChange={changeEventHandler}
//                   value={commentText}
//                   placeholder="Add a comment..."
//                   className="w-full outline-none border border-gray-300 p-2 rounded"
//                 />
//                 <Button
//                   disabled={!commentText}
//                   onClick={SendCommentHandler}
//                   variant="outline"
//                 >
//                   Post
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default CommentDialog;

import React, { useEffect, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment.jsx";
import axios from "axios";
import { setPosts, setSelectedPost } from "../ReduxStore/PostSlice.js";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { MessageCircle, MoreHorizontal, Send } from "lucide-react";
function CommentDialog({ CommentOpen, setCommentOpen }) {
  const [commentText, setcommentText] = useState("");
  const { SelectedPost } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);
  const Posts = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [CommentData, setCommentData] = useState([]);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const [like, setlike] = useState(SelectedPost?.likes?.includes(user?._id));
  const [likeCount, setlikeCount] = useState(SelectedPost?.likes?.length);
  const HandleLikeAndDislikePost = async () => {
    try {
      const action = like ? "dislike" : "like";
      const MainUri = import.meta.env.VITE_MainUri;
      const response = await axios.get(
        `${MainUri}/user/post/${SelectedPost._id}/${action}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        const updatedlikes = like ? likeCount - 1 : likeCount + 1;
        setlike(!like);
        setlikeCount(updatedlikes);
        const updatedpost = Posts.post.map((p) =>
          p._id === SelectedPost._id
            ? {
                ...p,
                likes: like
                  ? p.likes.filter((id) => id !== user?._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedpost));
        toast.success(response.data.message || "Post Liked!");
      } else {
        toast.error(response.data.message || "Post Like Failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
    }
  };

  useEffect(() => {
    setCommentData(SelectedPost?.comments || []);
    setlike(SelectedPost?.likes?.includes(user?._id));
    setlikeCount(SelectedPost?.likes?.length || 0);
  }, [SelectedPost, user?._id]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const changeEventHandler = (e) => {
    setcommentText(e.target.value);
  };

  const SendCommentHandler = async () => {
    try {
      const MainUri = import.meta.env.VITE_MainUri;
      const response = await axios.post(
        `${MainUri}/user/post/${SelectedPost._id}/comment`,
        { text: commentText },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        const newComment = response.data.comment;
        const updatedpost = Posts.post.map((p) =>
          p._id === SelectedPost._id
            ? { ...p, comments: [...p.comments, response.data.comment] }
            : p
        );
        const updatedSelectedPost = {
          ...SelectedPost,
          comments: [...SelectedPost.comments, newComment],
        };
        dispatch(setPosts(updatedpost));
        dispatch(setSelectedPost(updatedSelectedPost));
        setCommentData([...CommentData, newComment]);
        setcommentText("");
        toast.success(response.data.message || "Comment Added!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
    }
  };

  return (
    <Dialog open={CommentOpen}>
      <DialogContent
        onInteractOutside={() => setCommentOpen(false)}
        className="max-w-5xl p-0 flex flex-col"
      >
        <DialogTitle className="sr-only">Comments</DialogTitle>
        <DialogDescription className="sr-only">
          View and post comments on this post.
        </DialogDescription>
        <div className="flex flex-1">
          {/* Left Side - Media */}
          <div className="w-1/2 bg-black relative">
            {(() => {
              const fileUrl = SelectedPost?.file?.url ?? "";
              const fileType = SelectedPost?.file?.mimetype || "";

              const isVideo =
                fileType.startsWith("video/") ||
                /\.(mp4|webm|ogg)$/i.test(fileUrl);

              if (isVideo) {
                return (
                  <div
                    className="relative aspect-[11/16] w-full cursor-pointer"
                    onClick={() => {
                      if (videoRef.current) {
                        if (videoRef.current.paused) {
                          videoRef.current.play();
                        } else {
                          videoRef.current.pause();
                        }
                      }
                    }}
                  >
                    <video
                      ref={videoRef}
                      src={fileUrl}
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-cover rounded-md"
                    />
                    {/* Mute/Unmute Button */}
                    <button
                      onClick={toggleMute}
                      className="absolute bottom-3 right-3 bg-black/60 p-2 rounded-full text-white"
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                  </div>
                );
              }

              // Image fallback
              return (
                <img
                  src={fileUrl}
                  alt="Post"
                  className="w-full h-full object-cover aspect-square rounded-sm"
                />
              );
            })()}
          </div>

          {/* Right Side - Comments and Info */}
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={SelectedPost?.author?.profilePicture} />
                    <AvatarFallback>cn</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-col">
                  <Link className="font-semibold text-base">
                    {SelectedPost?.author?.username || "username"}
                  </Link>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    {user?._id !== SelectedPost?.author?._id && "Unfollow"}
                  </div>
                  <div className="cursor-pointer w-full">Add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />

            <div className="flex-1 p-4">
              <div className="flex gap-3 items-center mb-2">
                <Link>
                  <Avatar>
                    <AvatarImage src={SelectedPost?.author?.profilePicture} />
                    <AvatarFallback>cn</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-col">
                  <Link className="font-semibold text-base">
                    {SelectedPost?.author?.username || "username"}
                  </Link>
                  <span className="text-sm">{SelectedPost?.caption}</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[448px]">
                {CommentData?.length > 0 ? (
                  CommentData.map((comment) => (
                    <Comment key={comment._id} comment={comment} />
                  ))
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 flex-col">
                <div className="flex justify-start w-full flex-col gap-2">
                  <div className="flex gap-4 items-center">
                    {like ? (
                      <FaHeart
                        onClick={HandleLikeAndDislikePost}
                        size={22}
                        className="cursor-pointer text-red-600"
                      />
                    ) : (
                      <FaRegHeart
                        onClick={HandleLikeAndDislikePost}
                        size={22}
                        className="cursor-pointer hover:text-gray-600"
                      />
                    )}
                    <MessageCircle className="cursor-pointer hover:text-gray-600" />
                    <Send className="cursor-pointer hover:text-gray-600" />
                  </div>
                  <span>{likeCount} likes</span>
                </div>
                <div className="flex flex-row gap-2 w-full">
                  <input
                    type="text"
                    onChange={changeEventHandler}
                    value={commentText}
                    placeholder="Add a comment..."
                    className="w-full outline-none border border-gray-300 p-2 rounded"
                    autoFocus
                  />
                  <Button
                    disabled={!commentText}
                    onClick={SendCommentHandler}
                    variant="outline"
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
