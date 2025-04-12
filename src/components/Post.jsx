// import React, { useEffect, useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { MessageCircle, MoreHorizontal, Send } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { FaHeart } from "react-icons/fa";
// import { FaRegHeart } from "react-icons/fa";
// import { FaRegBookmark, FaBookmark } from "react-icons/fa";
// import CommentDialog from "./CommentDialog";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import { setPosts, setSelectedPost } from "../ReduxStore/PostSlice.js";
// import { Badge } from "@/components/ui/badge";
// import { setAuthUser } from "../ReduxStore/authSlice.js";
// import { Link } from "react-router-dom";
// function Post({ post }) {
//   const { user } = useSelector((store) => store.auth);
//   const Posts = useSelector((store) => store.post);
//   const dispatch = useDispatch();
//   const [text, setText] = useState("");
//   const [CommentOpen, setCommentOpen] = useState(false);
//   const [ThreeDotOpen, setThreeDotOpen] = useState(false);
//   const [like, setlike] = useState(post?.likes?.includes(user?._id));
//   const [bookmark, setbookmark] = useState(
//     user?.bookmarks?.includes(post?._id)
//   );
//   const [likeCount, setlikeCount] = useState(post?.likes?.length);
//   const [CommentData, setCommentData] = useState(post.comments);
//   const changeEventHandler = (e) => {
//     const inputText = e.target.value;
//     if (inputText.trim()) {
//       setText(inputText);
//     } else {
//       setText("");
//     }
//   };
//   const HandleLikeAndDislikePost = async () => {
//     try {
//       const action = like ? "dislike" : "like";
//       const response = await axios.get(
//         `http://localhost:7464/user/post/${post._id}/${action}`,
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );
//       if (response.data.success) {
//         const updatedlikes = like ? likeCount - 1 : likeCount + 1;
//         setlike(!like);
//         setlikeCount(updatedlikes);
//         const updatedpost = Posts.post.map((p) =>
//           p._id === post._id
//             ? {
//                 ...p,
//                 likes: like
//                   ? p.likes.filter((id) => id !== user?._id)
//                   : [...p.likes, user._id],
//               }
//             : p
//         );
//         dispatch(setPosts(updatedpost));
//         toast.success(response.data.message || "Post Liked!");
//       } else {
//         toast.error(response.data.message || "Post Like Failed");
//       }
//     } catch (error) {
//       toast.error(error.response.data.message || "Internal Server Error");
//     }
//   };
//   const HandleBookmark = async () => {
//     try {
//       const response = await axios.post(
//         `http://localhost:7464/user/post/${post._id}/bookmark`,
//         {},
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );
//       if (response.data.success) {
//         setbookmark(!bookmark);
//         const updatedUser = {
//           ...user,
//           bookmarks: bookmark
//             ? user.bookmarks.filter((id) => id !== post._id)
//             : [post._id, ...user.bookmarks],
//         };
//         dispatch(setAuthUser(updatedUser));
//         toast.success(response.data.message || "Post Saved!");
//       } else {
//         toast.error(response.data.message || "Post Saved Failed");
//       }
//     } catch (error) {
//       toast.error(error.response.data.message || "Internal Server Error");
//     }
//   };
//   const HandleCommentPost = async () => {
//     try {
//       const response = await axios.post(
//         `http://localhost:7464/user/post/${post._id}/comment`,
//         { text },
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );
//       if (response.data.success) {
//         setCommentData([...CommentData, response.data.comment]);
//         setText("");
//         const updatedpost = Posts.post.map((p) =>
//           p._id === post._id
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
//   const HandleDeletePost = async () => {
//     const deleteUri = `http://localhost:7464/user/post/delete/${post._id}`;
//     try {
//       const response = await axios.delete(deleteUri, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         withCredentials: true,
//       });
//       if (response.data.success) {
//         setThreeDotOpen(false);
//         const OriginalPosts = Posts.post.filter(
//           (Eachpost) => Eachpost._id !== post._id
//         );
//         dispatch(setPosts(OriginalPosts));
//         toast.success(response.data.message || "Post Deleted!");
//       } else {
//         toast.error(response.data.message || "Post Delete Failed");
//       }
//     } catch (error) {
//       toast.error(error.response.data.message || "Internal Server Error!");
//     }
//   };
//   return (
//     <div className="my-8 w-full max-w-sm mx-auto cursor-pointer">
//       <div className="flex items-center justify-between">
//         <Link to={`/profile/${post?.author?._id}`}>
//           <div className="flex items-center gap-2">
//             <Avatar>
//               <AvatarImage src={post?.author?.profilePicture} alt="User Avatar" />
//               <AvatarFallback>CN</AvatarFallback>
//             </Avatar>
//             <div className="flex item-center gap-3">
//               <h1 className="text-lg font-semibold">{post?.author?.username}</h1>
//               {user?._id === post?.author?._id && (
//                 <Badge variant="secondary">Author</Badge>
//               )}
//             </div>
//           </div>
//         </Link>
//         <Dialog open={ThreeDotOpen}>
//           <DialogTrigger asChild>
//             <Button
//               onClick={() => setThreeDotOpen(true)}
//               variant="ghost"
//               className="p-2"
//             >
//               <MoreHorizontal
//                 onClick={() => setThreeDotOpen(true)}
//                 className="cursor-pointer"
//               />
//             </Button>
//           </DialogTrigger>
//           <DialogContent
//             onInteractOutside={() => setThreeDotOpen(false)}
//             className="flex flex-col items-center text-sm text-center"
//           >
//             {post?.author?._id !== user?._id && (
//               <Button
//                 variant="ghost"
//                 className="cursor-pointer w-full text-red-500 font-bold"
//               >
//                 Unfollow
//               </Button>
//             )}

//             <Button variant="ghost" className="cursor-pointer w-full">
//               Add to Favorites
//             </Button>
//             {user && user?._id === post?.author?._id && (
//               <Button
//                 onClick={HandleDeletePost}
//                 variant="ghost"
//                 className="cursor-pointer w-full"
//               >
//                 Delete
//               </Button>
//             )}
//           </DialogContent>
//         </Dialog>
//       </div>
//       <img
//         className="rounded-sm my-2 w-full aspect-square object-cover"
//         src={post.image}
//         alt=""
//       />
//       <div className="flex justify-between">
//         <div className="flex gap-3">
//           {like ? (
//             <FaHeart
//               onClick={HandleLikeAndDislikePost}
//               size={"22px"}
//               className="cursor-pointer text-red-600"
//             />
//           ) : (
//             <FaRegHeart
//               onClick={HandleLikeAndDislikePost}
//               size={"22px"}
//               className="cursor-pointer hover:text-gray-600"
//             />
//           )}
//           <MessageCircle
//             onClick={() => {
//               dispatch(setSelectedPost(post));
//               setCommentOpen(true);
//             }}
//             className="cursor-pointer hover:text-gray-600"
//           />
//           <Send className="cursor-pointer hover:text-gray-600" />
//         </div>
//         {bookmark ? (
//           <FaBookmark
//             className="text-xl cursor-pointer"
//             onClick={HandleBookmark}
//           />
//         ) : (
//           <FaRegBookmark
//             className="text-xl cursor-pointer hover:text-gray-600"
//             onClick={HandleBookmark}
//           />
//         )}
//       </div>
//       <span className="font-medium block mb-2">{likeCount} likes</span>
//       <p>
//         <span className="font-medium mr-2">{post?.author?.username}</span>
//         {post.caption}
//       </p>
//       <span
//         onClick={() => {
//           dispatch(setSelectedPost(post));
//           setCommentOpen(true);
//         }}
//       >
//         view all {post.comments.length} comments
//       </span>
//       <CommentDialog
//         CommentOpen={CommentOpen}
//         setCommentOpen={setCommentOpen}
//       />
//       <div className="flex items-center justify-between">
//         <input
//           type="text"
//           placeholder="Add a comment..."
//           className="outline-none text-sm w-full"
//           value={text}
//           onChange={changeEventHandler}
//         />
//         {text && (
//           <span onClick={HandleCommentPost} className="text-[#3BA0F8]">
//             Post
//           </span>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Post;
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setSelectedPost } from "../ReduxStore/PostSlice.js";
import { Badge } from "@/components/ui/badge";
import { setAuthUser } from "../ReduxStore/authSlice.js";
import { Link } from "react-router-dom";

function Post({ post }) {
  const { user } = useSelector((store) => store.auth);
  const Posts = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [CommentOpen, setCommentOpen] = useState(false);
  const [ThreeDotOpen, setThreeDotOpen] = useState(false);
  const [like, setlike] = useState(post?.likes?.includes(user?._id));
  const [bookmark, setbookmark] = useState(user?.bookmarks?.includes(post?._id));
  const [likeCount, setlikeCount] = useState(post?.likes?.length);
  const [CommentData, setCommentData] = useState(post.comments);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const HandleLikeAndDislikePost = async () => {
    try {
      const action = like ? "dislike" : "like";
      const response = await axios.get(
        `http://localhost:7464/user/post/${post._id}/${action}`,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      if (response.data.success) {
        const updatedlikes = like ? likeCount - 1 : likeCount + 1;
        setlike(!like);
        setlikeCount(updatedlikes);
        const updatedpost = Posts.post.map((p) =>
          p._id === post._id
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

  const HandleBookmark = async () => {
    try {
      const response = await axios.post(
        `http://localhost:7464/user/post/${post._id}/bookmark`,
        {},
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      if (response.data.success) {
        setbookmark(!bookmark);
        const updatedUser = {
          ...user,
          bookmarks: bookmark
            ? user.bookmarks.filter((id) => id !== post._id)
            : [post._id, ...user.bookmarks],
        };
        dispatch(setAuthUser(updatedUser));
        toast.success(response.data.message || "Post Saved!");
      } else {
        toast.error(response.data.message || "Post Saved Failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
    }
  };

  const HandleCommentPost = async () => {
    try {
      const response = await axios.post(
        `http://localhost:7464/user/post/${post._id}/comment`,
        { text },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      if (response.data.success) {
        setCommentData([...CommentData, response.data.comment]);
        setText("");
        const updatedpost = Posts.post.map((p) =>
          p._id === post._id
            ? { ...p, comments: [...p.comments, response.data.comment] }
            : p
        );
        dispatch(setPosts(updatedpost));
        toast.success(response.data.message || "Comment Added!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
    }
  };

  const HandleDeletePost = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:7464/user/post/delete/${post._id}`,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      if (response.data.success) {
        setThreeDotOpen(false);
        const OriginalPosts = Posts.post.filter((Eachpost) => Eachpost._id !== post._id);
        dispatch(setPosts(OriginalPosts));
        toast.success(response.data.message || "Post Deleted!");
      } else {
        toast.error(response.data.message || "Post Delete Failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error!");
    }
  };

  return (
    <div className="my-8 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto cursor-pointer px-3">
      <div className="flex items-center justify-between mb-2">
        <Link to={`/profile/${post?.author?._id}`}>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={post?.author?.profilePicture} alt="User Avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-semibold">{post?.author?.username}</h1>
              {user?._id === post?.author?._id && (
                <Badge variant="secondary">Author</Badge>
              )}
            </div>
          </div>
        </Link>

        <Dialog open={ThreeDotOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setThreeDotOpen(true)} variant="ghost" className="p-2">
              <MoreHorizontal className="cursor-pointer" />
            </Button>
          </DialogTrigger>
          <DialogContent
            onInteractOutside={() => setThreeDotOpen(false)}
            className="flex flex-col items-center text-sm text-center"
          >
            {post?.author?._id !== user?._id && (
              <Button variant="ghost" className="cursor-pointer w-full text-red-500 font-bold">
                Unfollow
              </Button>
            )}
            <Button variant="ghost" className="cursor-pointer w-full">
              Add to Favorites
            </Button>
            {user && user?._id === post?.author?._id && (
              <Button onClick={HandleDeletePost} variant="ghost" className="cursor-pointer w-full">
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <img
        className="rounded-md my-2 w-full aspect-square object-cover"
        src={post.image}
        alt="Post"
      />

      <div className="flex justify-between items-center my-2">
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
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setCommentOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        {bookmark ? (
          <FaBookmark className="text-xl cursor-pointer" onClick={HandleBookmark} />
        ) : (
          <FaRegBookmark className="text-xl cursor-pointer hover:text-gray-600" onClick={HandleBookmark} />
        )}
      </div>

      <span className="font-medium block mb-2 text-sm md:text-base">{likeCount} likes</span>

      <p className="text-sm md:text-base">
        <span className="font-medium mr-2">{post?.author?.username}</span>
        {post.caption}
      </p>

      <span
        onClick={() => {
          dispatch(setSelectedPost(post));
          setCommentOpen(true);
        }}
        className="text-gray-600 text-sm mt-1 inline-block"
      >
        View all {post.comments.length} comments
      </span>

      <CommentDialog CommentOpen={CommentOpen} setCommentOpen={setCommentOpen} />

      <div className="flex items-center justify-between mt-2 border-t pt-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="outline-none text-sm w-full bg-transparent px-1"
          value={text}
          onChange={changeEventHandler}
        />
        {text && (
          <span onClick={HandleCommentPost} className="text-[#3BA0F8] text-sm ml-2 cursor-pointer">
            Post
          </span>
        )}
      </div>
    </div>
  );
}

export default Post;
