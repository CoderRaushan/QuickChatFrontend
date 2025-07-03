import React, { useEffect, useRef, useState } from "react";
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
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

function Post({ post }) {
  const { user } = useSelector((store) => store.auth);
  const Posts = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [CommentOpen, setCommentOpen] = useState(false);
  const [ThreeDotOpen, setThreeDotOpen] = useState(false);
  const [like, setlike] = useState(post?.likes?.includes(user?._id));
  const [bookmark, setbookmark] = useState(
    user?.bookmarks?.includes(post?._id)
  );
  const [likeCount, setlikeCount] = useState(post?.likes?.length);
  const [CommentData, setCommentData] = useState(post.comments);
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const HandleLikeAndDislikePost = async () => {
    try {
      const action = like ? "dislike" : "like";
      const MainUri = import.meta.env.VITE_MainUri;
      const response = await axios.get(
        `${MainUri}/user/post/${post._id}/${action}`,
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
      const MainUri = import.meta.env.VITE_MainUri;
      const response = await axios.post(
        `${MainUri}/user/post/${post._id}/bookmark`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
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
      const MainUri = import.meta.env.VITE_MainUri;
      const response = await axios.post(
        `${MainUri}/user/post/${post._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
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
      const MainUri = import.meta.env.VITE_MainUri;
      const response = await axios.delete(
        `${MainUri}/user/post/delete/${post._id}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setThreeDotOpen(false);
        const OriginalPosts = Posts.post.filter(
          (Eachpost) => Eachpost._id !== post._id
        );
        dispatch(setPosts(OriginalPosts));
        toast.success(response.data.message || "Post Deleted!");
      } else {
        toast.error(response.data.message || "Post Delete Failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error!");
    }
  };

  // const fileExtension = post?.image?.split(".").pop()?.toLowerCase() || "";
  const file = post?.file?.url;
  const fileExtension =
    post?.file?.filename?.split(".").pop()?.toLowerCase() ||
    post?.file?.mimetype?.split("/").pop()?.toLowerCase() ||
    "";

  const renderVideo = () => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false); // Initially unmuted

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            video.play();
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        },
        { threshold: 0.6 }
      );

      observer.observe(video);

      return () => {
        observer.unobserve(video);
      };
    }, []);

    const handleVideoClick = () => {
      const video = videoRef.current;
      if (!video) return;

      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    };

    const toggleMute = (e) => {
      e.stopPropagation(); // prevent video from playing/pausing on icon click
      const video = videoRef.current;
      if (!video) return;

      video.muted = !video.muted;
      setIsMuted(video.muted);
    };
    return (
      <div className="relative flex flex-col items-start my-2">
        <video
          ref={videoRef}
          src={file}
          className="w-full max-h-72 rounded-lg object-cover"
          loop
          playsInline
          muted={isMuted}
          onClick={handleVideoClick}
        />

        {/* Mute/Unmute Icon */}
        <button
          onClick={toggleMute}
          className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white p-2 rounded-full"
        >
          {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
        </button>
      </div>
    );
  };

  const renderDocument = () => (
    <div className="my-4">
      <iframe
        src={`https://docs.google.com/gview?url=${encodeURIComponent(
          file
        )}&embedded=true`}
        className="w-full h-96 rounded-md border"
        title="Document Preview"
      >
        Your browser does not support iframes.
      </iframe>
    </div>
  );

  const renderImage = () => (
    <img
      className="rounded-md my-2 w-full aspect-square object-cover"
      src={file}
      alt="Post"
    />
  );
  const renderAudio = () => (
    <div className="my-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md flex items-center space-x-4">
      <div className="flex-shrink-0">
        <i className="fa-solid fa-music text-2xl text-blue-600 dark:text-blue-400"></i>
      </div>
      <div className="w-full">
        <audio src={file} controls className="w-full focus:outline-none">
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );

  const renderPDF = () => (
    <div className="my-2">
      <iframe
        src={file}
        className="w-full h-96 rounded-md"
        title="PDF Preview"
      />
    </div>
  );
  return (
    <div className="my-8 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto cursor-pointer px-3">
      <div className="flex items-center justify-between mb-2">
        <Link to={`/profile/${post?.author?._id}`}>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={post?.author?.profilePicture}
                alt="User Avatar"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-semibold">
                {post?.author?.username}
              </h1>
              {user?._id === post?.author?._id && (
                <Badge variant="secondary">Author</Badge>
              )}
            </div>
          </div>
        </Link>

        <Dialog open={ThreeDotOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setThreeDotOpen(true)}
              variant="ghost"
              className="p-2"
            >
              <MoreHorizontal className="cursor-pointer" />
            </Button>
          </DialogTrigger>
          <DialogContent
            onInteractOutside={() => setThreeDotOpen(false)}
            className="flex flex-col items-center text-sm text-center"
          >
            {post?.author?._id !== user?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-full text-red-500 font-bold"
              >
                Unfollow
              </Button>
            )}
            <Button variant="ghost" className="cursor-pointer w-full">
              Add to Favorites
            </Button>
            {user && user?._id === post?.author?._id && (
              <Button
                onClick={HandleDeletePost}
                variant="ghost"
                className="cursor-pointer w-full"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {[
        "mp4",
        "webm",
        "ogg",
        "mov",
        "m4v",
        "avi",
        "wmv",
        "flv",
        "f4v",
        "mkv",
        "3gp",
        "3g2",
        "mts",
        "m2ts",
        "ts",
        "vob",
        "rm",
        "rmvb",
        "asf",
        "divx",
        "xvid",
        "amv",
        "mjpeg",
        "mpg",
        "mpeg",
      ].includes(fileExtension)
        ? renderVideo()
        : fileExtension === "pdf"
        ? renderPDF()
        : [
            "mp3",
            "wav",
            "aac",
            "flac",
            "opus",
            "ogg",
            "m4a",
            "wma",
            "alac",
            "aiff",
            "amr",
            "au",
            "mid",
            "midi",
            "mp2",
            "ac3",
            "ra",
            "dts",
            "tta",
            "vox",
            "pcm",
            "caf",
            "8svx",
            "snd",
          ].includes(fileExtension)
        ? renderAudio()
        : ["doc", "docx", "odt", "rtf", "txt"].includes(fileExtension)
        ? renderDocument()
        : renderImage()}

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
          <FaBookmark
            className="text-xl cursor-pointer"
            onClick={HandleBookmark}
          />
        ) : (
          <FaRegBookmark
            className="text-xl cursor-pointer hover:text-gray-600"
            onClick={HandleBookmark}
          />
        )}
      </div>
      <span className="font-medium block mb-2 text-sm md:text-base">
        {likeCount} likes
      </span>
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
      <CommentDialog
        CommentOpen={CommentOpen}
        setCommentOpen={setCommentOpen}
      />
      <div className="flex items-center justify-between mt-2 border-t pt-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="outline-none text-sm w-full bg-transparent px-1"
          value={text}
          onChange={changeEventHandler}
        />
        {text && (
          <span
            onClick={HandleCommentPost}
            className="text-[#3BA0F8] text-sm ml-2 cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
}

export default Post;
