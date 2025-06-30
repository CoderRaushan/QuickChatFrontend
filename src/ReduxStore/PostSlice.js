import { createSlice } from "@reduxjs/toolkit";
const PostSlice = createSlice({
    name: 'post',
    initialState:
    {
        post: [],
        SelectedPost: null
    },
    reducers:
    {
        setPosts: (state, action) => {
            state.post = action.payload;
        },
        setSelectedPost: (state, action) => {
            state.SelectedPost = action.payload;
        },
    }
});
export const { setPosts,setSelectedPost } = PostSlice.actions;
export default PostSlice.reducer;