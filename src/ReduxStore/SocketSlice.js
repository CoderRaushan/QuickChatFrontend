import { createSlice } from "@reduxjs/toolkit";
const SocketSlice = createSlice({
    name: 'socketio',
    initialState:
    {
        socket: null,
    },
    reducers:
    {
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
    }
});
export const { setSocket } = SocketSlice.actions;
export default SocketSlice.reducer;