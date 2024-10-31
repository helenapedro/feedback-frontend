import React, { useEffect } from 'react';
import { AppDispatch, RootState } from './redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { fetchUserDetailsAsync, logoutUser, setUserId } from './redux/userSlice';
import { jwtDecode } from 'jwt-decode';

import NavBar from './components/NavBar';
import Login from './pages/Login';
import ResumeList from './pages/ResumeList';
import ResumeDetails from './pages/ResumeDetails';
import ResumeUploadForm from './components/ResumeUploadForm';
import ProtectedRoute from './utils/ProtectedRoute';
import Logout from './components/Logout';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.userId);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (token) {
      try {
        const decodedToken: { userId: string, exp: number } = jwtDecode(token);
        console.log('decodedToken: ', decodedToken);

        if (decodedToken.userId) {
          dispatch(setUserId(decodedToken.userId));

          dispatch(fetchUserDetailsAsync(decodedToken.userId)).unwrap().catch(() => {
            dispatch(logoutUser());
          });
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        dispatch(logoutUser());
      }
    }
  }, [dispatch, token]);

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
          <Route path="/resumes/upload" element={<ResumeUploadForm />} />
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
