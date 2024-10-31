import React, { useEffect } from 'react';
import { AppDispatch, RootState } from './redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { fetchUserDetailsAsync, selectUserId, logoutUser } from './redux/userSlice';

import NavBar from './components/NavBar';
import Login from './pages/Login';
import ResumeList from './pages/ResumeList';
import ResumeDetails from './pages/ResumeDetails';
import ResumeUploadForm from './components/ResumeUploadForm';
import ProtectedRoute from './utils/ProtectedRoute';
import Logout from './components/Logout';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector(selectUserId);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('token: ', token);
    console.log('userId: ', userId);

    if (token && userId ) {
      console.log('This is on the If statemant');
      console.log('token: ', token);
      console.log('userId: ', userId);

      dispatch(fetchUserDetailsAsync(userId)).unwrap().catch(() => {
        dispatch(logoutUser());
      });
    }
  }, [dispatch, userId]);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        <Route path="/resumes" element={<ProtectedRoute element={<ResumesLayout />} />}>
          <Route index element={<ResumeList />} />
          <Route path="/resumes/:id" element={<ResumeDetails />} />
          <Route path="upload" element={<ResumeUploadForm />} />
        </Route>
        <Route path="/logout" element={<ProtectedRoute element={<Logout />}/>} />
      </Routes>
    </Router>
  );
};

const ResumesLayout = () => {
  return (
    <Outlet />
  );
};

export default App;
