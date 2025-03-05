import { createSlice } from "@reduxjs/toolkit";
const ChatSlice = createSlice({
    name: 'chat',
    initialState:
    {
        onlineUsers: [],
    },
    reducers:
    {
        setOnlineUsers: (state, action) => {
            state.onlineUsers=action.payload;
        },
    }
});
export const {setOnlineUsers }=ChatSlice.actions;
export default ChatSlice.reducer;