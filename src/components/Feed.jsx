import React, { useEffect, useState } from "react";
import Posts from "./Posts.jsx";
import StoryCard from "./story/StoryCard.jsx";
import { AiFillPlusCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import "./scrollbar.css";
import CreatePost from "./CreatePost.jsx";
import axios from "axios";
function Feed() {
  const { user } = useSelector((store) => store.auth);
  const MainUri = import.meta.env.VITE_MainUri;
  const [followings, setFollowings] = useState([]);
  const [followingsIds, setFollowingsIds] = useState([]);
  useEffect(() => {
    setFollowingsIds(user?.following?.map((f) => f._id) || []);
  }, [user?.following]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.post(
          `${MainUri}/user/story/following/stories`,
          { followings: followingsIds },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          const transformed = res.data.stories.reduce((acc, story) => {
            const userId = story.author._id;

            // Check if the author is already added
            let existingUser = acc.find((u) => u.author._id === userId);

            if (!existingUser) {
              // Initialize a new author group with an empty story array
              existingUser = {
                _id: story._id,
                author: {
                  _id: story.author._id,
                  username: story.author.username,
                  name: story.author.name,
                  profilePicture: story.author.profilePicture,
                },
                story: [],
              };
              acc.push(existingUser);
            }

            // Push this story to the user's story array
            existingUser.story.push({
              caption: story.caption,
              createdAt: story.createdAt,
              mediaType: story.mediaType,
              mediaUrl: story.mediaUrl,
              likes: story.likes || [],
              viewers: story.viewers || [],
            });

            return acc;
          }, []);

          setFollowings(transformed);
        }
      } catch (err) {
        console.error("Error fetching stories:", err);
      }
    };

    fetchStories();
  }, [followingsIds]);

  // console.log("Followings:", followingsIds);
  const [createOpen, setCreateOpen] = useState(false);
  // const followings = [
  //   { _id: "3hseiower8oimjefois", username: "abcd", name: "ABCD" },
  //   { _id: "3hsdfiower8oimjeddis", username: "dfgh", name: "EFGH" },
  //   { _id: "3hsei34eder8osdfdois", username: "ijkl", name: "IJKL" },
  // ];

  return (
    <div className="flex-1 my-8 flex flex-col items-center pl-[20%]">
      <div className="flex w-[796px] h-[120px] overflow-x-scroll gap-2 hide-scrollbar">
        <div className="relative">
          <StoryCard
            userId={user?._id}
            username={"Your Story"}
            profilePicture={user?.profilePicture}
          />
          <AiFillPlusCircle
            className="absolute bottom-0 right-0 top-12 bg-white rounded-full font-bold cursor-pointer"
            size={24}
            onClick={() => setCreateOpen(true)}
          />
        </div>
        {followings?.map((f) => {
          return (
            <StoryCard
              key={f?.author?._id}
              data={f}
            />
          );
        })}
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
