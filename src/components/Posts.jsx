import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Post from "./Post.jsx";
import { setPosts } from "../ReduxStore/PostSlice.js";
import axios from "axios";
// import  usegetallposts from "../hooks/usegetallposts.jsx";
import { throttle } from "../Utils/Utils.js";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";
function Posts() {
  const dispatch = useDispatch();
  const postState = useSelector((store) => store.post).post;

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const BATCH = 5;
  const MainUri = import.meta.env.VITE_MainUri;

  useEffect(() => {
    const fetchInitialPosts = async () => {
      const MainUri = import.meta.env.VITE_MainUri;
      try {
        const res = await axios.get(`${MainUri}/user/post/all?skip=0&limit=5`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setPosts(res.data.posts)); 
        } else {
          toast.error(res.data.message || "Fetch failed");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Server error");
      }
    };
    fetchInitialPosts();
  }, [dispatch]);

  const fetchNext = async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${MainUri}/user/post/all?skip=${page * BATCH}&limit=${BATCH}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        if (res.data.posts.length === 0) {
          setHasMore(false);
        } else {
          dispatch(setPosts([...postState, ...res.data.posts]));
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
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= (scrollHeight - 50)) {
        fetchNext();
      }
    }, 300),
    [page, hasMore, isLoading, postState]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div>
      {postState.map((post) => (
        <Post key={post._id} post={post} />
      ))}

      {isLoading && (
        <div className="flex justify-center my-4">
          <LoaderCircle className="animate-spin text-gray-700" size={32} />
        </div>
      )}

      {!hasMore && !isLoading && (
        <p style={{ textAlign: "center", margin: "1rem 0" }}>
          🎉 All posts loaded
        </p>
      )}
    </div>
  );
}

export default Posts;


// import React from "react";
// import Post from "./Post.jsx";
// import { useSelector } from "react-redux";
// function Posts() {
//   const Posts = useSelector((store) => store.post);
//   // console.log("Posts ",Posts)
//   return (
//     <div>
//       {Posts.post.map((post) => (
//         <Post key={post._id} post={post} />
//       ))}
//     </div>
//   );
// }

// export default Posts;

// import React, { useEffect, useState, useCallback } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import Post from "./Post.jsx";
// import { setPosts } from "../ReduxStore/PostSlice.js";
// import axios from "axios";
// import useGetAllPosts from "../hooks/useGetAllPosts.jsx";
// import { throttle } from "../Utils/Utils.js";

// function Posts() {
//   const dispatch = useDispatch();
//   // const { post: postState } = useSelector((store) => store.post); // posts array
//   const postState = (useSelector((store) => store.post)).post;
//   console.log("postState",postState);
//   const [page, setPage] = useState(1);          // pehla batch hook se aaya (0 wala)
//   const [hasMore, setHasMore] = useState(true);
//   const BATCH = 5;
//   const MainUri = import.meta.env.VITE_MainUri;

//   useGetAllPosts();  // initial 5 posts load karne ke liye

//   const fetchNext = async () => {
//     if (!hasMore) return;
//     try {
//       const res = await axios.get(
//         `${MainUri}/user/post/all?skip=${page * BATCH}&limit=${BATCH}`,
//         { withCredentials: true }
//       );

//       if (res.data.success) {
//         if (res.data.posts.length === 0) {
//           setHasMore(false); // aur koi post nahi hai
//           return;
//         }
//         dispatch(setPosts([...postState, ...res.data.posts])); // existing + new
//         setPage((prev) => prev + 1);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleScroll = useCallback(
//     throttle(() => {
//       const { scrollTop, scrollHeight, clientHeight } =
//         document.documentElement;
//       if (scrollTop + clientHeight >= scrollHeight - 50) {
//         fetchNext();
//       }
//     }, 400),
//     [page, hasMore, postState]
//   );

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [handleScroll]);

//   return (
//     <div>
//       {postState.map((post) => (
//         <Post key={post._id} post={post} />
//       ))}

//       {!hasMore && (
//         <p style={{ textAlign: "center", margin: "1rem 0" }}>
//           🎉 All posts loaded
//         </p>
//       )}
//     </div>
//   );
// }

// export default Posts;

// import React, { useEffect, useState, useCallback } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import Post from "./Post.jsx";
// import { setPosts } from "../ReduxStore/PostSlice.js";
// import axios from "axios";
// import useGetAllPosts from "../hooks/useGetAllPosts";
// import { throttle } from "../Utils/Utils.js";
// import { LoaderCircle } from "lucide-react";

// function Posts() {
//   const dispatch = useDispatch();
//   const postState = useSelector((store) => store.post).post;

//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [isLoading, setIsLoading] = useState(false); // 👈 loading state

//   const BATCH = 5;
//   const MainUri = import.meta.env.VITE_MainUri;

//   useGetAllPosts(); // Initial posts

//   const fetchNext = async () => {
//     if (!hasMore || isLoading) return;

//     setIsLoading(true); // 👈 start loading
//     try {
//       const res = await axios.get(
//         `${MainUri}/user/post/all?skip=${page * BATCH}&limit=${BATCH}`,
//         { withCredentials: true }
//       );

//       if (res.data.success) {
//         if (res.data.posts.length === 0) {
//           setHasMore(false);
//         } else {
//           dispatch(setPosts([...postState, ...res.data.posts]));
//           setPage((prev) => prev + 1);
//         }
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsLoading(false); // 👈 stop loading
//     }
//   };

//   const handleScroll = useCallback(
//     throttle(() => {
//       const { scrollTop, scrollHeight, clientHeight } =
//         document.documentElement;
//       if (scrollTop + clientHeight >= scrollHeight - 50) {
//         fetchNext();
//       }
//     }, 400),
//     [page, hasMore, isLoading, postState]
//   );

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [handleScroll]);

//   return (
//     <div>
//       {postState.map((post) => (
//         <Post key={post._id} post={post} />
//       ))}

//       {isLoading && (
//         <div className="flex justify-center my-4">
//           <LoaderCircle className="animate-spin text-gray-700" size={32} />
//         </div>
//       )}

//       {!hasMore && !isLoading && (
//         <p style={{ textAlign: "center", margin: "1rem 0" }}>
//           🎉 All posts loaded
//         </p>
//       )}
//     </div>
//   );
// }

// export default Posts;