import mongoose from 'mongoose';

export interface User {
  _id: string;
  id: string;
  username: string;
  email: string;
  //password: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  token: string;
  user: User;
}

export interface IResume {
  _id: string; 
  posterId: {
    _id: string; 
    username: string; 
    email: string; 
    isAdmin: boolean; 
    isActive: boolean
  } 
  format: 'pdf' | 'docx' | 'jpg' | 'jpeg' | 'png'; 
  description: string;
  url: string;
  createdAt: Date; 
  updatedAt: Date; 
}

export interface IResumesResponse {
  totalResumes: number;
  currentPage: number;
  totalPages: number;
  resumes: IResume[]; 
}

export interface Comment {
  _id: string; 
  resumeId: string; 
  commenterId: {
    _id: string;
    username: string;
  };
  content: string; 
  isDeleted: boolean; 
  createdAt: Date; 
  updatedAt: Date; 
  user?: User;
}

export interface AddCommentPayload {
  resumeId: string;
  content: string;
}

export interface UpdateCommentPayload {
  commentId: string;
  content: string;
}
