import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IComment } from '../types';

interface CommentState {
  data: IComment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  data: [],
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    loadComments(state, action: PayloadAction<IComment[]>) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    addComment(state, action: PayloadAction<IComment>) {
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

export const { loadComments, addComment, setLoading, setError } = commentSlice.actions;

export default commentSlice.reducer;
