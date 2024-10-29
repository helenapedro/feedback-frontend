import axios, { AxiosResponse } from 'axios';
import { IUser } from '../types';

const API_URL = process.env.REACT_APP_API_URL;
const TOKEN_KEY = 'authToken';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchUserDetails = async (userId: string): Promise<AxiosResponse<IUser>> => {
  return api.get(`/api/auth/user/${userId}`);
};

export const updateUserDetails = async (userId: string, data: { username?: string; email?: string }) => {
  return api.put(`/api/auth/user/${userId}`, data);
};

export const updateUserPassword = async (userId: string, currentPassword: string, newPassword: string) => {
  return api.post(`/api/auth/user/${userId}/password`, { currentPassword, newPassword });
};

export const deleteUserAccount = async (userId: string): Promise<AxiosResponse<void>> => {
  return api.delete(`/api/auth/user/${userId}`);
};