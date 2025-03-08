import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:null,
    suggestedUsers:[],
    UserProfile:null,
    selectedUsers:null,
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
    },
    setselectedUsers: (state, action) => {
      state.selectedUsers=action.payload; 
    }
  },
});

export const { setAuthUser, setsuggestedUsers, setUserProfile, setselectedUsers} = authSlice.actions;
export default authSlice.reducer;
