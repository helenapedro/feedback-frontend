import axios from 'axios';
import { ResumeVersion } from '../types';

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const uploadResume = async (file: File, format: string, description?: string) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('format', format);
  if (description) formData.append('description', description);

  const response = await axios.post(`${API_URL}/api/resumes/upload`, formData, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return response.data;
};

export const updateResume = async (id: string, file: File, format: string, description?: string) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('format', format);
  if (description) formData.append('description', description);

  const response = await axios.put(`${API_URL}/api/resumes/${id}`, formData, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return response.data;
}

export const updateResumeDescription = async (id: string, description: string) => {
  const response = await axios.put(
    `${API_URL}/api/resumes/update-description`,
    { description },
    { headers: { ...getAuthHeaders() } }
  );
  return response.data;
};


export const fetchResumes = async (page: number = 1, limit: number = 10, format?: string, createdAt?: string) => {
  const response = await axios.get(`${API_URL}/api/resumes/all`, {
    headers: { ...getAuthHeaders() },
    params: { page, limit, format, createdAt },
  });
  return response.data;
};

export const fetchResumeDetails = async (id: string) => {
  const response = await axios.get(`${API_URL}/api/resumes/${id}`, {
    headers: { ...getAuthHeaders() },
  });
  return response.data;
};

export const fetchCurrentUserResume = async () => {
  const response = await axios.get(`${API_URL}/api/resumes`, {
    headers: { ...getAuthHeaders() },
  });
  return response.data;
};


export async function fetchResumeVersions(resumeId: string): Promise<ResumeVersion[]> {
  try {
    const response = await axios.get(`${API_URL}/api/resumes/${resumeId}/versions`, {
      headers: { ...getAuthHeaders() },
    });

    if (!response) {
      throw new Error("Failed to fetch resume versions");
    }
  
    return response.data.versions;
  } catch (error) {
    console.error("Error fetching user resumes:", error);
    throw error;
  }
}

export const deleteResume = async (id: string) => {
  const response = await axios.delete(`${API_URL}/api/resumes`, {
    headers: { ...getAuthHeaders() },
  });
  return response.data;
};
