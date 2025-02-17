import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TestPost from "../assets/Test/post.jpg";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
function CommentDialog({ CommentOpen, setCommentOpen }) 
{
  const [commentText,setcommentText]=useState("")
  const changeEventHandler = (e) => 
  {
    const inputText = e.target.value;
    if (inputText.trim()) 
    {
      setcommentText(inputText);
    }
  };
  const SendCommentHandler=async()=>
  {
    alert(commentText);
  }
  return (
    <Dialog open={CommentOpen}>
      <DialogContent
        onInteractOutside={() => setCommentOpen(false)}
        className="max-w-5xl p-0 flex flex-col"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src={TestPost}
              alt="post_img"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>cn</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">username</Link>
                  {/* <span>Bio here....</span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">Add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              comments ayenge
            </div>
            <div className="p-4">
              <div className="flex item-center gap-2">
                <input
                  type="text"
                  onChange={changeEventHandler}
                  placeholder="Add a comment...."
                  className="w-full outline-none border border-gray-300 p-2 rounded"
                />
                <Button disabled={!commentText} onClick={SendCommentHandler} variant="outline">Post</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
