import { createSlice } from "@reduxjs/toolkit";
const RealTimeNotificationSlice=createSlice({
    name:"Notification",
    initialState:{
        likeNotification:[], 
    },
    reducers:{
        setLikeNotification:(state,action)=>
        {
            if(action.payload.type==="like")
            {
                state.likeNotification.push(action.payload);
            }
            else if(action.payload.type==="dislike")
            {
                state.likeNotification = state.likeNotification.filter(
                    (item) => item.userId !== action.payload.userId
                );
            }
        }
    }
})
export const { setLikeNotification} = RealTimeNotificationSlice.actions;
export default RealTimeNotificationSlice.reducer;