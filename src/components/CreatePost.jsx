import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { readFileAsDataURL } from "../Utils/Utils.js";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Loader2, Turtle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../ReduxStore/PostSlice.js";
function CreatePost({ createPostOpen, setcreatePostOpen }) {
  const imageRef = useRef();
  const [file, setfile] = useState("");
  // console.log(file);
  const [caption, setcaption] = useState("");
  const [ImagePreview, setImagePreview] = useState("");
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const { post } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);
  const filechangeHanlder = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setfile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };
  const CreatePostHandler = async (e) => {
    e.preventDefault();
    setloading(true);
    if (!file) {
      toast.error("Please select an image to upload");
      return;
    }
    const MainUri = import.meta.env.VITE_MainUri;
    const res = await axios.post(
      `${MainUri}/user/message/get-upload-url`,
      {
        fileType: file.type,
        originalName: file.name,
      },
      {
        withCredentials: true,
      }
    );
    const uploadUrl = res.data.uploadUrl || "";
    const fileUrl = res.data.fileUrl || "";
    if (res.data.success && uploadUrl && fileUrl) {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
      if (response) {
        try {
          const res = await axios.post(
            `${MainUri}/user/post/add`,
            {
              caption,
              fileUrl,
              mimetype: file.type,
              filename: file.name,
              size: file.size,
            },
            {
              withCredentials: true,
            }
          );
          if (res.data.success) {
            // console.log("post data",res.data.post);
            dispatch(setPosts([res.data.post, ...post]));
            toast.success(res.data.message || "post successfully");
            setcaption("");
            setfile("");
            setImagePreview("");
            setcreatePostOpen(false);
          } else {
            toast.error(res.data.message || "post failed");
          }
        } catch (error) {
          toast.error(error.response.data.message || "post falied");
        } finally {
          setloading(false);
          setcreatePostOpen(false);
        }
      }
    } else {
      console.log("file not uploaded to aws s3");
    }
  };
  return (
    <Dialog open={createPostOpen}>
      <DialogContent onInteractOutside={() => setcreatePostOpen(false)}>
        <VisuallyHidden>
          <DialogTitle className="text-center font-semibold">
            Create New Post
          </DialogTitle>
        </VisuallyHidden>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage
              className="w-10 h-10 rounded-full"
              src={user?.profilePicture}
              alt="User Avatar"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">
              {user?.username || "username"}
            </h1>
            <span className="text-gray-600 text-xs">{user?.bio}</span>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setcaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a Caption..."
        />
        {ImagePreview && (
          <div className="w-full h-64 flex items-center justify-center ">
            <img
              src={ImagePreview}
              alt=""
              className="object-cover h-full w-full rounded-md"
            />
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          name="image"
          onChange={filechangeHanlder}
        />
        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095f6] hover:bg-[#258bcf]"
        >
          Select From Computer
        </Button>
        {ImagePreview &&
          (loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              onClick={CreatePostHandler}
              type="submit"
              className="w-full"
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
}
export default CreatePost;
//6:35
