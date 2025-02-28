import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:null,
    suggestedUsers:[],
    UserProfile:null
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user=action.payload; 
    },
    setsuggestedUsers: (state, action) => {
      state.suggestedUsers=action.payload; 
    },
    setUserProfile: (state, action) => {
      state.UserProfile=action.payload; 
    }
  },
});

export const { setAuthUser, setsuggestedUsers, setUserProfile} = authSlice.actions;
export default authSlice.reducer;
