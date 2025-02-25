import { createSlice } from "@reduxjs/toolkit";
const isLoginSlice=createSlice({
    name:'isLogin',
    initialState:
    {
        isLogin:false,
    },
    reducers:
    {
        setisLogin:(state,action)=>
        {
            state.isLogin=action.payload;
        }
    }
});
export const {setisLogin}=isLoginSlice.actions;
export default isLoginSlice.reducer;