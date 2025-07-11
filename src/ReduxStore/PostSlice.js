import { createSlice } from "@reduxjs/toolkit";
const PostSlice = createSlice({
    name: 'post',
    initialState:
    {
        post: [],
        SelectedPost: null,
        ExplorePost:[]
    },
    reducers:
    {
        setPosts: (state, action) => {
            state.post = action.payload;
        },
        setExplorePost: (state, action) => {
            state.ExplorePost = action.payload;
        },
        setSelectedPost: (state, action) => {
            state.SelectedPost = action.payload;
        },
    }
});
export const { setPosts,setSelectedPost,setExplorePost } = PostSlice.actions;
export default PostSlice.reducer;