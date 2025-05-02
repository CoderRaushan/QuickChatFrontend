import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setPosts } from '../ReduxStore/PostSlice.js';
import { setsuggestedUsers } from '../ReduxStore/authSlice.js';

function useGetAllSuggestedUsers() 
{
    const dispatch=useDispatch();
    useEffect(()=>{
        const fetchAllSuggestedUsers=async()=>
        {
            const MainUri=import.meta.env.VITE_MainUri;
            try {
                const response = await axios.get(`${MainUri}/user/suggested`,{
                    headers:{'Content-Type':'application/json'},
                    withCredentials: true,
                });
                if(response.data.success)
                {
                    dispatch(setsuggestedUsers(response.data.users));
                    // toast.success(response.data.message || "Users Fetched!");
                }
                else 
                {
                    toast.success(response.data.message || "Users Fetch Failed!");
                }
            } catch (error) {
                toast.error(error.response.data.message || "Internal Server Error!");
            }
        }
        fetchAllSuggestedUsers();
    },[])
}

export default useGetAllSuggestedUsers;