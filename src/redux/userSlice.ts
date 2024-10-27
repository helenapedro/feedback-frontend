import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser as apiLoginUser, logoutUser as apiLogoutUser } from '../api/authApi';
import { IUser } from '../types'; 
import { RootState } from './store';
import mongoose from 'mongoose';

interface UserState {
  isLoggedIn: boolean;
  userId: string | mongoose.Types.ObjectId | null;
  user: IUser | null; 
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  userId: null,
  user: null, 
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.userId = action.payload.user._id;
        state.user = action.payload.user;
        localStorage.setItem('authToken', action.payload.token);
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.userId = null;
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
    },
  });

  export const loginUserAsync = createAsyncThunk<
    { token: string; user: IUser }, 
    { email: string; password: string },
    { rejectValue: string }
  >('user/loginUser', async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiLoginUser(email, password);
      return response.data;
    } catch (error) {
      return rejectWithValue('Login failed. Please check your credentials.');
    }
  });

  export const logoutUser = createAsyncThunk('user/logoutUser', async (_, { rejectWithValue }) => {
    try {
      await apiLogoutUser();
      localStorage.removeItem('authToken');
    } catch (error) {
      return rejectWithValue('Logout failed.');
    }
  });

// Selectors
export const selectIsAuthenticated = (state: RootState) => !!state.user.isLoggedIn && !!localStorage.getItem('authToken');
export const selectUserInfo = (state: RootState) => state.user.user;

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;
