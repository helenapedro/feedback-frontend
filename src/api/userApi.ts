import axios from 'axios';
import { UserResponse, User } from '../types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const registerUser = async (userData: Partial<User>): Promise<UserResponse> => {
  const response = await api.post<UserResponse>('/api/auth/register', userData);
  return response.data;
};

export const loginUser = async (email: string, password: string): Promise<UserResponse> => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

export const getUser = async (userId: string, token: string): Promise<User> => {
  const response = await api.get(`/api/auth/user/${userId}`);
  return response.data;
};

export const updateUser = async (userData: Partial<User>): Promise<User> => {
  const response = await api.put('/api/auth/user/update', userData);
  return response.data;
};

export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  await api.post('/api/auth/user/change-password', { oldPassword, newPassword });
};

export const deleteUser = async (): Promise<void> => {
  await api.delete('/api/auth/user/delete');
};
