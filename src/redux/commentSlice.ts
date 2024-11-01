import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IComment } from '../types';
import * as api from '../services/api';

interface CommentState {
  data: IComment[];
  updateCommentStatus: string;
  totalPages: number;
  successMessage: string;
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  data: [],
  updateCommentStatus: 'idle',
  totalPages: 0,
  successMessage: '',
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    resetUpdateStatus: (state) => {
      state.updateCommentStatus = 'idle';
      state.successMessage = '';
    },
    clearSuccessMessage: (state) => {
      state.successMessage = '';
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    updateCommentInState(state, action: PayloadAction<IComment>) {
      const index = state.data.findIndex((Comment) => Comment._id === action.payload._id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentsAsync.fulfilled, (state, action: PayloadAction<IComment[]>) => {
        state.loading = false;
        state.data = action.payload; 
      })
      .addCase(fetchCommentsAsync.rejected, (state, action) => {
        state.updateCommentStatus = 'rejected';
        state.error = action.error.message || 'Failed to fetch comments';
      })

      .addCase(addCommentAsync.fulfilled, (state, action: PayloadAction<IComment>) => {
        const newComment = action.payload;
        const { _id, ...rest} = newComment;
        state.data.push({ ...rest, _id});        
      })
      .addCase(addCommentAsync.rejected, (state, action) => {
        state.updateCommentStatus = 'rejected';
        state.error = action.error.message || 'Failed to add comment';
        /* state.loading = false;
        state.error = action.error.message || 'Failed to add comment'; */
      })

      .addCase(updateCommentAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCommentAsync.fulfilled, (state, action: PayloadAction<IComment>) => {
        state.loading = false;
        const index = state.data.findIndex(comment => comment._id === action.payload._id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateCommentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update comment';
      })

      .addCase(deleteCommentAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCommentAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.data = state.data.filter(comment => comment._id !== action.payload); 
      })
      .addCase(deleteCommentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete comment';
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
      console.log('Response; ', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to add comment:', error);
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

export const { setLoading, setError, resetUpdateStatus, clearSuccessMessage, updateCommentInState } = commentSlice.actions;

export default commentSlice.reducer;
