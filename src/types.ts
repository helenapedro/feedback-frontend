import mongoose from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResume {
  _id: mongoose.Types.ObjectId; 
  posterId: mongoose.Types.ObjectId; 
  format: 'pdf' | 'docx' | 'jpg' | 'jpeg' | 'png'; 
  url: string;
  createdAt: Date; 
  updatedAt: Date; 
}

export interface IComment {
  _id: mongoose.Types.ObjectId; 
  resumeId: mongoose.Types.ObjectId; 
  commenterId: mongoose.Types.ObjectId; 
  content: string; 
  isDeleted: boolean; 
  createdAt: Date; 
  updatedAt: Date; 
}
