import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setUserProfile } from '../ReduxStore/authSlice.js';
function useGetUserProfile(userId) 
{
    const dispatch=useDispatch();
    useEffect(()=>{
        const fetchUserProfile=async()=>
        {
            const Uri=`http://localhost:7464/user/${userId}/profile`;
            try {
                const response = await axios.get(Uri,{
                    headers:{'Content-Type':'application/json'},
                    withCredentials: true,
                });
                if(response.data.success)
                {
                    dispatch(setUserProfile(response.data.user));
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
        fetchUserProfile();
    },[userId])
}

export default useGetUserProfile;