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

export const updateUserDetails = async (data: { username?: string; email?: string }): Promise<AxiosResponse<IUser>> => {
  return api.put(`/api/auth/user/update`, data);
};

export const updateUserPassword = async (data: { currentPassword: string; newPassword: string }): Promise<AxiosResponse<void>> => {
  return api.post(`/api/auth/user/change-password`, data);
};

export const deleteUserAccount = async (): Promise<AxiosResponse<void>> => {
  return api.delete(`/api/auth/user/delete`);
};