import React from "react";
import Post from "./Post.jsx";
import { useSelector } from "react-redux";
function Posts() {
  const Posts = useSelector((store) => store.post);
  return (
    <div>
      {Posts.post.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}

export default Posts;
