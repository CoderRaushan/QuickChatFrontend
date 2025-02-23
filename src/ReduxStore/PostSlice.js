import { createSlice } from "@reduxjs/toolkit";
const PostSlice=createSlice({
    name:'post',
    initialState:
    {
        post:[],
    },
    reducers:
    {
        setPosts:(state,action)=>
        {
            state.post=action.payload;
        }
    }
});
export const {setPosts}=PostSlice.actions;
export default PostSlice.reducer;