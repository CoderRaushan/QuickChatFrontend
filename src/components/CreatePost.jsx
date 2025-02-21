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
function CreatePost({ createPostOpen, setcreatePostOpen }) {
  const imageRef = useRef();
  const [file, setfile] = useState("");
  const [caption, setcaption] = useState("");
  const [ImagePreview, setImagePreview] = useState("");
  const [loading, setloading] = useState(false);
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
    const formdata=new FormData();
    formdata.append("caption",caption);
    if(ImagePreview) formdata.append("image",file);
    const URI=import.meta.env.VITE_CreatePost;
    try {
        setloading(true);
        const res= await axios.post(URI,formdata,
        {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials:true
        });
        console.log(res);
        if(res.data.success)
        {
         toast.success(res.data.message || "post successfully");
        }
        else 
        {
            toast.error(res.data.message || "post failed");
        }
    } catch (error) {
      console.log();
        toast.error(error.response.data.message || "post falied");
    }finally{
        setloading(false);
        setcreatePostOpen(false);
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
            <AvatarImage src="your-image-src-here" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">Username</h1>
            <span className="text-gray-600 text-xs">Bio here...</span>
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