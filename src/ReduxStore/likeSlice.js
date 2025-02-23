import { createSlice } from "@reduxjs/toolkit";
const likeSlice=createSlice({
    name:'like',
    initialState:
    {
        like:false,
    },
    reducers:
    {
        setlike:(state,action)=>
        {
            state.like=action.payload;
        }
    }
});
export const {setlike}=likeSlice.actions;
export default likeSlice.reducer;