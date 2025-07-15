import { createSlice } from "@reduxjs/toolkit";
const ChatSlice = createSlice({
    name: 'chat',
    initialState:
    {
        onlineUsers: [],
        messages: [],
        chatHistory: [],
        conversationMap: {},
        chatNotifications: {},
    },
    reducers:
    {
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setchatHistory: (state, action) => {
            state.chatHistory = action.payload;
        }, 
        setConversationMap: (state, action) => {
            state.conversationMap = action.payload;
        },
        setChatNotifications: (state, action) => {
            state.chatNotifications = action.payload;
        },
    }
});
export const { setOnlineUsers, setMessages, setchatHistory, setConversationMap, setChatNotifications } = ChatSlice.actions;
export default ChatSlice.reducer;
