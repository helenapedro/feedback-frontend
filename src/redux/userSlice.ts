import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../types'; 

interface UserState {
  isLoggedIn: boolean;
  userId: string | null;
  user: IUser | null; 
}

const initialState: UserState = {
  isLoggedIn: false,
  userId: null,
  user: null, 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ userId: string; user: IUser }>) => {
      state.isLoggedIn = true;
      state.userId = action.payload.userId;
      state.user = action.payload.user;
    },    
    logout: (state) => {
      state.isLoggedIn = false;
      state.userId = null;
      state.user = null; 
    },
    updateUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload; 
    },
  },
});

export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
