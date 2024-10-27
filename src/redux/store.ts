import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import resumeReducer from './resumeSlice';
import commentReducer from './commentSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    resumes: resumeReducer,
    comments: commentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
