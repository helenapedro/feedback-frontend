import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchResumes = async (page: number = 1, limit: number = 10, format?: string, createdAt?: string) => {
  const response = await axios.get(`${API_URL}/api/resumes`, {
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

export const uploadResume = async (file: File, format: string) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('format', format);

  const response = await axios.post(`${API_URL}/api/resumes/upload`, formData, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return response.data;
};

export const fetchCommentsByResume = async (resumeId: string) => {
  const response = await axios.get(`${API_URL}/api/comments/${resumeId}`, {
    headers: { ...getAuthHeaders() },
  });
  return response.data;
};


export const addComment = async (resumeId: string, content: string) => {
  const response = await axios.post(`${API_URL}/api/comments/add`, { resumeId, content }, {
    headers: { ...getAuthHeaders() },
  });
  return response.data;
};


export const updateComment = async (commentId: string, content: string) => {
  return axios.put(`${API_URL}/api/comments/${commentId}`, { content }, {
    headers: {
      ...getAuthHeaders(),
    },
  });
};

export const deleteComment = async (commentId: string) => {
  return axios.delete(`${API_URL}/api/comments/${commentId}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
};
