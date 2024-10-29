import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser as apiLoginUser } from '../api/authApi';
import * as userapi from '../api/userApi';
import * as adminapi from '../api/adminApi';
import { IUser } from '../types';
import { RootState } from './store';
import mongoose from 'mongoose';

interface UserState {
  isLoggedIn: boolean;
  userId: string | mongoose.Types.ObjectId | null;
  user: IUser | null;
  users: IUser[]; // Admin: list of users
  adminStatus: string;
  updateUserStatus: string, 
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  userId: null,
  user: null, 
  users: [],
  adminStatus: 'idle',
  updateUserStatus: 'idle',
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
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    resetUpdateStatus(state) {
      state.updateUserStatus = 'idle';
    },
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.userId = null;
      state.user = null;
      localStorage.removeItem('authToken');
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

      .addCase(fetchUserDetailsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserDetailsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserDetailsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateUserDetailsAsync.pending, (state) => {
        state.updateUserStatus = 'loading';
      })
      .addCase(updateUserDetailsAsync.fulfilled, (state, action) => {
        state.updateUserStatus = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateUserDetailsAsync.rejected, (state, action) => {
        state.updateUserStatus = 'failed';
        state.error = action.payload as string;
      })

      .addCase(updateUserPasswordAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserPasswordAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUserPasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAllUsersAsync.pending, (state) => {
        state.adminStatus = 'loading';
      })
      .addCase(fetchAllUsersAsync.fulfilled, (state, action) => {
        state.adminStatus = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchAllUsersAsync.rejected, (state, action) => {
        state.adminStatus = 'failed';
        state.error = action.payload as string;
      })

      .addCase(deactivateUserAsync.pending, (state) => {
        state.adminStatus = 'loading';
      })
      .addCase(deactivateUserAsync.fulfilled, (state) => {
        state.adminStatus = 'succeeded';
      })
      .addCase(deactivateUserAsync.rejected, (state, action) => {
        state.adminStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const loginUserAsync = createAsyncThunk<
  { token: string; user: IUser }, 
  { email: string; password: string },
  { rejectValue: string }
  >(
    'user/loginUser', 
    async ({ email, password }, { rejectWithValue }) => {
      try {
        const response = await apiLoginUser(email, password);
        return response.data;
      } catch (error: any) {
        return rejectWithValue('Login failed. Please check your credentials.');
      }
  }
);

export const fetchUserDetailsAsync = createAsyncThunk<IUser, string, { rejectValue: string }>(
  'user/fetchUserDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userapi.fetchUserDetails(userId);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch user details.';
      return rejectWithValue(errorMessage);
    }
  }
);


export const updateUserDetailsAsync = createAsyncThunk<
  IUser,
  { data: { username?: string; email?: string } },
  { rejectValue: string }
>(
  'user/updateUserDetails', 
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await userapi.updateUserDetails(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to update user details.');
    }
  }
);

export const updateUserPasswordAsync = createAsyncThunk<
  void,
  { currentPassword: string; newPassword: string },
  { rejectValue: string }
>(
  'user/updateUserPassword', 
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      await userapi.updateUserPassword({ currentPassword, newPassword });
    } catch (error: any) {
      return rejectWithValue('Failed to update password.');
    }
  }
);


// Admin actions
export const fetchAllUsersAsync = createAsyncThunk<IUser[], void, { rejectValue: string }>(
  'user/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminapi.fetchAllUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch users.');
    }
  }
);

export const deactivateUserAsync = createAsyncThunk<
  void,
  string,
  { rejectValue: string }>
  ('user/deactivateUser', async (userId, { rejectWithValue }) => {
    try {
      await adminapi.deactivateUser(userId);
    } catch (error) {
      return rejectWithValue('Failed to deactivate user.');
    }
  }
);


export const selectIsAuthenticated = (state: RootState) => state.user.isLoggedIn;
export const selectUserInfo = (state: RootState) => state.user.user;
export const selectAdminUsers = (state: RootState) => state.user.users;

export const { updateUser,setUser, resetUpdateStatus, logoutUser } = userSlice.actions;
export default userSlice.reducer;
