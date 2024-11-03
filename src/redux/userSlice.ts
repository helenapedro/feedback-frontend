import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { registerUser, loginUser, getUser } from '../api/userApi';
import { User, UserResponse } from '../types';
import { RootState } from './store';

interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  user: null,
  token: localStorage.getItem('authToken'),
  loading: false,
  error: null,
  isLoggedIn: !!localStorage.getItem('authToken'),
};

// Register user
export const register = createAsyncThunk<UserResponse, Partial<User>>(
  'user/register',
  async (userData, thunkAPI) => {
    try {
      return await registerUser(userData);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Login user
export const login = createAsyncThunk<UserResponse, { email: string; password: string }>(
  'user/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('authToken', data.token);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Fetch user data
export const fetchUser = createAsyncThunk<User>(
  'user/fetchUser',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('authToken');
      const state = thunkAPI.getState() as RootState;
      const userId = state.user.user?._id;

      if (!token || !userId) {
        throw new Error('No valid token or user ID found');
      }

      const user = await getUser(userId, token);
      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem('authToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<UserResponse>) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<UserResponse>) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export const selectUserInfo = (state: RootState) => state.user.user;
export default userSlice.reducer;
