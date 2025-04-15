import * as api from '../services/api';
import { IResume, IResumesResponse, ResumeVersion } from '../types';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface ResumeState {
  data: IResumesResponse | null;
  selected: IResume | null;
  currentUserResume: IResume | null; // New state for current user's resume
  versions: ResumeVersion[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: ResumeState = {
  data: null,
  selected: null,
  currentUserResume: null, // Initialize current user's resume
  versions: null,
  loading: false,
  error: null,
};

// Async Thunks
export const uploadResumeAsync = createAsyncThunk<IResume, { file: File; format: string; description?: string }>(
  'resumes/uploadResume',
  async ({ file, format, description }) => {
    const response = await api.uploadResume(file, format, description);
    return response;
  }
);

export const fetchResumesAsync = createAsyncThunk<IResumesResponse, { page?: number; limit?: number; format?: string; createdAt?: string }>(
  'resumes/fetchResumes',
  async ({ page = 1, limit = 10, format, createdAt }) => {
    const response = await api.fetchResumes(page, limit, format, createdAt);
    return response;
  }
);

export const updateResumeAsync = createAsyncThunk<IResume, { id: string; file: File; format: string; description?: string }>(
  'resumes/updateResume',
  async ({ id, file, format, description }) => {
    const response = await api.updateResume(id, file, format, description);
    return response;
  }
);

export const updateResumeDescriptionAsync = createAsyncThunk<IResume, { id: string; description: string; }>(
  'resumes/updateResumeDescription',
  async ({ id, description}) => {
    const response = await api.updateResumeDescription(id, description);
    return response;
  }
);


export const loadResumeDetails = createAsyncThunk<IResume, string>(
  'resumes/loadResumeDetails',
  async (id) => {
    const response = await api.fetchResumeDetails(id);
    return response;
  }
);

// New Async Thunk to load the current user's resume
export const loadCurrentUserResume = createAsyncThunk<IResume, void>(
  'resumes/loadCurrentUserResume',
  async () => {
    const response = await api.fetchCurrentUserResume();
    return response;
  }
);

export const fetchResumeVersionsAsync = createAsyncThunk<ResumeVersion[], string>(
  'resumes/fetchResumeVersions',
  async (resumeId, { rejectWithValue }) => {
    try {
      const response = await api.fetchResumeVersions(resumeId);
      if (!response) {
        throw new Error("Failed to fetch resume versions");
      }
      return response;
    } catch (error) {
      console.error("Error fetching resume versions:", error);
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteResumeAsync = createAsyncThunk<void, string>(
  'resumes/deleteResume',
  async (id) => {
    await api.deleteResume(id);
    //return id;
  }
);

const resumeSlice = createSlice({
  name: 'resumes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadResumeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadResumeAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data) {
          state.data.resumes.push(action.payload);
        }
      })
      .addCase(uploadResumeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error uploading resume';
      })
      .addCase(fetchResumesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumesAsync.fulfilled, (state, action: PayloadAction<IResumesResponse>) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchResumesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching resumes';
      })
      .addCase(loadResumeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadResumeDetails.fulfilled, (state, action: PayloadAction<IResume>) => {
        state.selected = action.payload;
        state.loading = false;
      })
      .addCase(loadResumeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching resume details';
      })
      .addCase(loadCurrentUserResume.pending, (state) => { // Handle loading state for current user's resume
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCurrentUserResume.fulfilled, (state, action: PayloadAction<IResume>) => { // Handle successful fetch
        state.loading = false;
        state.currentUserResume = action.payload;
      })
      .addCase(loadCurrentUserResume.rejected, (state, action) => { // Handle error state
        state.loading = false;
        state.error = action.error.message || 'Error fetching current user\'s resume';
      })
      .addCase(updateResumeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateResumeAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data) {
          const index = state.data.resumes.findIndex((resume) => resume._id === action.payload._id);
          if (index !== -1) {
            state.data.resumes[index] = action.payload;
          }
        }
        if (state.currentUserResume?._id === action.payload._id) {
          state.currentUserResume = action.payload; // Update current user's resume if it was updated
        }
        if (state.selected?._id === action.payload._id) {
          state.selected = action.payload; // Update selected resume if it was updated
        }
      })
      .addCase(updateResumeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error updating resume';
      })
      .addCase(updateResumeDescriptionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateResumeDescriptionAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data) {
          const index = state.data.resumes.findIndex((resume) => resume._id === action.payload._id);
          if (index !== -1) {
            state.data.resumes[index] = action.payload;
          }
        }
        if (state.currentUserResume?._id === action.payload._id) {
          state.currentUserResume = action.payload; // Update current user's resume if it was updated
        }
        if (state.selected?._id === action.payload._id) {
          state.selected = action.payload; // Update selected resume if it was updated
        }
      })
      .addCase(updateResumeDescriptionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error updating resume description';
      })
      .addCase(deleteResumeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumeVersionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumeVersionsAsync.fulfilled, (state, action: PayloadAction<ResumeVersion[]>) => {
        state.versions = action.payload;
        state.loading = false;
      })
      .addCase(fetchResumeVersionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteResumeAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data) {
          state.data.resumes = state.data.resumes.filter(resume => resume._id !== action.meta.arg);
        }
        if (state.currentUserResume?._id === action.meta.arg) {
          state.currentUserResume = null; // Clear current user's resume if deleted
        }
        if (state.selected?._id === action.meta.arg) {
          state.selected = null; // Clear selected resume if deleted
        }
      })
      .addCase(deleteResumeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error deleting resume';
      });
  },
});

export default resumeSlice.reducer;