import React, { useState } from "react";
import Posts from "./Posts.jsx";
import StoryCard from "./story/StoryCard.jsx";
import { AiFillPlusCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import "./scrollbar.css";
import CreatePost from "./CreatePost.jsx";
function Feed() {
  const { user } = useSelector((store) => store.auth);
  const [createOpen, setCreateOpen] = useState(false);
  const followings = [
    { _id: "3hseiower8oimjefois", username: "abcd", name: "ABCD" },
    { _id: "3hsdfiower8oimjeddis", username: "dfgh", name: "EFGH" },
    { _id: "3hsei34eder8osdfdois", username: "ijkl", name: "IJKL" },
  ];
  return (
    <div className="flex-1 my-8 flex flex-col items-center pl-[20%]">
      <div className="flex w-[796px] h-[120px] overflow-x-scroll gap-2 hide-scrollbar">
        <div className="relative">
          <StoryCard
            userId={user._id}
            username={"Your Story"}
            profilePicture={user?.profilePicture}
          />
          <AiFillPlusCircle
            className="absolute bottom-0 right-0 top-12 bg-white rounded-full font-bold cursor-pointer"
            size={24}
            onClick={() => setCreateOpen(true)}
          />
        </div>
        {followings?.map((f) => (
          <StoryCard
            key={f?._id}
            userId={f?._id}
            username={f?.username}
            profilePicture={f?.profilePicture}
          />
        ))}
        <CreatePost
          createPostOpen={createOpen}
          setcreatePostOpen={setCreateOpen}
        />
      </div>
      <Posts />
    </div>
  );
}

export default Feed;
