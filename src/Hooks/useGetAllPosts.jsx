
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setPosts } from "../ReduxStore/PostSlice.js";

function useGetAllPosts() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchInitialPosts = async () => {
      const MainUri = import.meta.env.VITE_MainUri;
      try {
        const res = await axios.get(`${MainUri}/user/post/all?skip=0&limit=5`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setPosts(res.data.posts)); // sirf first 5 posts set karo
        } else {
          toast.error(res.data.message || "Fetch failed");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Server error");
      }
    };

    fetchInitialPosts();
  }, [dispatch]);
}
export default useGetAllPosts;
// import axios from 'axios'
// import React, { useEffect } from 'react'
// import { useDispatch } from 'react-redux';
// import { toast } from 'react-toastify';
// import { setPosts } from '../ReduxStore/PostSlice.js';

// function useGetAllPosts() 
// {
//     const dispatch=useDispatch();
//     useEffect(()=>{
//         const fetchAllPosts=async()=>
//         {
//             const MainUri=import.meta.env.VITE_MainUri;
//             try {
//                 const response = await axios.get(`${MainUri}/user/post/all`,{
//                     headers:{'Content-Type':'application/json'},
//                     withCredentials: true,
//                 });
//                 if(response.data.success)
//                 {
//                     // console.log(response.data.posts);
//                     dispatch(setPosts(response.data.posts));
//                     // toast.success(response.data.message || "Posts Fetched Successfully!");
//                 }
//                 else 
//                 {
//                     toast.success(response.data.message || "Posts Fetch Failed!");
//                 }
//             } catch (error) {
//                 toast.error(error.response.data.message || "Internal Server Error!");
//             }
//         }
//         fetchAllPosts();
//     },[])
// }

// export default useGetAllPosts;
// src/hooks/useGetAllPosts.js
