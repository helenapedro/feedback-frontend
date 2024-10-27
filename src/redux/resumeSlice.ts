import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IResume } from '../types'; 

interface ResumeState {
  data: IResume[];
  selected: IResume | null;
  loading: boolean;
  error: string | null;
}

const initialState: ResumeState = {
  data: [],
  selected: null,
  loading: false,
  error: null,
};

const resumeSlice = createSlice({
  name: 'resumes',
  initialState,
  reducers: {
    loadResumes(state, action: PayloadAction<IResume[]>) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    loadResumeDetails(state, action: PayloadAction<IResume>) {
      state.selected = action.payload;
    },
    addResume(state, action: PayloadAction<IResume>) {
      state.data.push(action.payload); 
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { loadResumes, loadResumeDetails, addResume, setLoading, setError } = resumeSlice.actions;

export default resumeSlice.reducer;
