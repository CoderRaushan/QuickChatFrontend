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
            const Uri=import.meta.env.VITE_FetchPosts;
            try {
                const response = await axios.get(Uri,{
                    headers:{'Content-Type':'application/json'},
                    withCredentials: true,
                });
                if(response.data.success)
                {
                    dispatch(setPosts(response.data.posts));
                    toast.success(response.data.message || "Posts Fetched Successfully!");
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