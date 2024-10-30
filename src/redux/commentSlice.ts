import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IComment } from '../types';
import * as api from '../services/api';

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
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommentsAsync.fulfilled, (state, action: PayloadAction<IComment[]>) => {
        state.loading = false;
        state.data = action.payload; 
        state.error = null;
      })
      .addCase(fetchCommentsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch comments';
      })
      .addCase(addCommentAsync.fulfilled, (state, action: PayloadAction<IComment>) => {
        state.data.push(action.payload); 
      })
      .addCase(updateCommentAsync.fulfilled, (state, action: PayloadAction<IComment>) => {
        const index = state.data.findIndex(comment => comment._id === action.payload._id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteCommentAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.data = state.data.filter(comment => comment._id !== action.payload); 
      });
  },
});

export const fetchCommentsAsync = createAsyncThunk<IComment[], string>(
  'comments/fetchComments',
  async (resumeId, { rejectWithValue }) => {
    try {
      const response = await api.fetchCommentsByResume(resumeId);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch comments');
    }
  }
);

export const addCommentAsync = createAsyncThunk<IComment, { resumeId: string; content: string }>(
  'comments/addComment',
  async ({ resumeId, content }, { rejectWithValue }) => {
    try {
      const response = await api.addComment(resumeId, content);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to add comment');
    }
  }
);

export const updateCommentAsync = createAsyncThunk<IComment, { commentId: string; content: string }>(
  'comments/updateComment',
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await api.updateComment(commentId, content);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update comment');
    }
  }
);

export const deleteCommentAsync = createAsyncThunk<string, string>(
  'comments/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      await api.deleteComment(commentId);
      return commentId;
    } catch (error) {
      return rejectWithValue('Failed to delete comment');
    }
  }
);

export const { setLoading, setError } = commentSlice.actions;

export default commentSlice.reducer;
