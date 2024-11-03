import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Comment, AddCommentPayload, UpdateCommentPayload } from '../types';
import * as api from '../api/commentApi';

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

export const fetchComments = createAsyncThunk(
  'comments/fetchComments', 
  async (resumeId: string) => {
    return await api.getCommentsByResume(resumeId);
});

export const addNewComment = createAsyncThunk(
  'comments/addComment', 
  async (payload: AddCommentPayload) => {
    return await api.addComment(payload);
});

export const updateExistingComment = createAsyncThunk(
  'comments/updateComment', 
  async (payload: UpdateCommentPayload) => {
    return await api.updateComment(payload);
});

export const removeComment = createAsyncThunk(
  'comments/deleteComment', 
  async (commentId: string) => {
    await api.deleteComment(commentId);
  return commentId;
});

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action: PayloadAction<Comment[]>) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch comments';
      })
      .addCase(addNewComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.comments.push(action.payload);
      })
      .addCase(updateExistingComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        const index = state.comments.findIndex((comment) => comment._id === action.payload._id);
        if (index !== -1) state.comments[index] = action.payload;
      })
      .addCase(removeComment.fulfilled, (state, action: PayloadAction<string>) => {
        state.comments = state.comments.filter((comment) => comment._id !== action.payload);
      });
  },
});

export default commentSlice.reducer;
