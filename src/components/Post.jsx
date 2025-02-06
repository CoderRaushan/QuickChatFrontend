import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import TestPost from "../assets/Test/post.jpg";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
function Post() {
  return (
    <div className="my-8 w-full max-w-sm mx-auto cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" alt="User Avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="text-lg font-semibold">Username</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="p-2">
              <MoreHorizontal className="cursor-pointer" />
            </Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-full text-red-500 font-bold"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-full">
              Add to Favorites
            </Button>
            <Button variant="ghost" className="cursor-pointer w-full">
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={TestPost}
        alt=""
      />
      <div className="flex justify-between">
        <div className="flex gap-3">
          <FaRegHeart
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
          />
          <MessageCircle className="cursor-pointer hover:text-gray-600" />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-2">1k likes</span>
      <p>
        <span className="font-medium mr-2">username </span>
        caption
      </p>
      <span>view all 10 comments</span>
      {/* done till 5:16 */}
    </div>
  );
}git commit -m"added feed ,rightSideBar  posts and post components";


export default Post;
