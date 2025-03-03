import axios from 'axios';
import { AddCommentPayload, UpdateCommentPayload, Comment } from '../types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuthHeaders = () => {
     const token = localStorage.getItem('authToken');
     return token ? { Authorization: `Bearer ${token}` } : {};
};
   

export const addComment = async (payload: AddCommentPayload): Promise<Comment> => {
  const response = await api.post('/api/comments/add', payload, {
    headers: { ...getAuthHeaders() },
  });
  return response.data;
};

export const getCommentsByResume = async (resumeId: string): Promise<Comment[]> => {
  try {
    const response = await api.get(`/api/comments/${resumeId}`, {
       headers: { ...getAuthHeaders() },
    });
    return response.data;

  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return [];
    }
    throw error;
  }
};

export const updateComment = async (payload: UpdateCommentPayload): Promise<Comment> => {
  const response = await api.put(`/api/comments/${payload.commentId}`, { content: payload.content }, {
     headers: { ...getAuthHeaders() },
  });
  return response.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await api.delete(`/api/comments/${commentId}`, {
     headers: { ...getAuthHeaders() },
  });
};