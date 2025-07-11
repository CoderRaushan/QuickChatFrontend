import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Post from "./Post.jsx";
import { setExplorePost } from "../ReduxStore/PostSlice.js";
import axios from "axios";
import { throttle } from "../Utils/Utils.js";
import { LoaderCircle } from "lucide-react";
import Masonry from "react-masonry-css";
function Explore() {
  const dispatch = useDispatch();
  const ExplorePost = useSelector((store) => store.post.ExplorePost);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const BATCH = 5;
  const MainUri = import.meta.env.VITE_MainUri;
  console.log(ExplorePost);
  useEffect(() => {
    const fetchInitialPosts = async () => {
      const MainUri = import.meta.env.VITE_MainUri;
      try {
        const res = await axios.get(
          `${MainUri}/user/post/explore/videos?skip=0&limit=5`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setExplorePost(res.data.posts));
          console.log(res.data.posts);
        } else {
          // toast.error(res.data.message || "Fetch failed");
          console.log(res.data.message);
        }
      } catch (err) {
        // toast.error(err.response?.data?.message || "Server error");
        console.log(err);
      }
    };
    fetchInitialPosts();
  }, [dispatch]);

  const fetchNext = async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${MainUri}/user/post/explore/videos?skip=${
          page * BATCH
        }&limit=${BATCH}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        if (res.data.posts.length === 0) {
          setHasMore(false);
        } else {
          dispatch(setExplorePost([...ExplorePost, ...res.data.posts]));
          setPage((prev) => prev + 1);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Throttled scroll handler
  const handleScroll = useCallback(
    throttle(() => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        fetchNext();
      }
    }, 300),
    [page, hasMore, isLoading, ExplorePost]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="p-4 flex-1">
      <Masonry
        breakpointCols={{
          default: 3,
          1100: 2,
          700: 1,
        }}
        className="my-masonry-grid "
        columnClassName="my-masonry-grid_column"
      >
        {ExplorePost?.map((post) => (
          <div
            key={post._id}
            className="overflow-hidden rounded-lg shadow-md bg-white"
          >
            <video
              src={post?.file?.url}
              muted
              controls={false}
              className="w-full h-auto rounded cursor-pointer hover:opacity-90 transition"
              preload="metadata"
            />
          </div>
        ))}
      </Masonry>
      {isLoading && (
        <div className="flex justify-center my-4">
          <LoaderCircle className="animate-spin text-gray-700" size={32} />
        </div>
      )}
      {!hasMore && !isLoading && (
        <p className="text-center my-4 text-gray-600">🎉 All posts loaded</p>
      )}
    </div>
  );
}

export default Explore;
