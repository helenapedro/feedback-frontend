import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../services/api'; 
import { IResume, IResumesResponse } from '../types'; 

interface ResumeState {
  data: IResumesResponse | null;
  selected: IResume | null; 
  loading: boolean;
  error: string | null;
}

const initialState: ResumeState = {
  data: null,
  selected: null,
  loading: false,
  error: null,
};

// Async Thunks
export const uploadResumeAsync = createAsyncThunk<IResume, { file: File; format: string }>(
  'resumes/uploadResume',
  async ({ file, format }) => {
    const response = await api.uploadResume(file, format);
    return response;
  }
);

export const fetchResumesAsync = createAsyncThunk<IResumesResponse>(
  'resumes/fetchResumes',
  async () => {
    const response = await api.fetchResumes();
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

// Slice
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
      });

    // Fetch Resumes Handlers
    builder
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
      });

    builder
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
      });
  },
});

export default resumeSlice.reducer;
