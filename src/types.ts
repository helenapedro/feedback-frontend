import mongoose from 'mongoose';

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResume {
  _id: string; 
  posterId: string; 
  format: 'pdf' | 'docx' | 'jpg' | 'jpeg' | 'png'; 
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
  commenterId: string; 
  content: string; 
  isDeleted: boolean; 
  createdAt: Date; 
  updatedAt: Date; 
  //user?: IUser;
}

export interface AddCommentPayload {
  resumeId: string;
  content: string;
}

export interface UpdateCommentPayload {
  commentId: string;
  content: string;
}
