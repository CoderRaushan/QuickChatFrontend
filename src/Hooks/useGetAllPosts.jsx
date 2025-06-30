import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setPosts } from '../ReduxStore/PostSlice.js';

function useGetAllPosts() 
{
    const dispatch=useDispatch();
    useEffect(()=>{
        const fetchAllPosts=async()=>
        {
            const MainUri=import.meta.env.VITE_MainUri;
            try {
                const response = await axios.get(`${MainUri}/user/post/all`,{
                    headers:{'Content-Type':'application/json'},
                    withCredentials: true,
                });
                if(response.data.success)
                {
                    // console.log(response.data.posts);
                    dispatch(setPosts(response.data.posts));
                    // toast.success(response.data.message || "Posts Fetched Successfully!");
                }
                else 
                {
                    toast.success(response.data.message || "Posts Fetch Failed!");
                }
            } catch (error) {
                toast.error(error.response.data.message || "Internal Server Error!");
            }
        }
        fetchAllPosts();
    },[])
}

export default useGetAllPosts;