import React, { useEffect } from 'react';
import { AppDispatch } from './redux/store';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { fetchUserDetailsAsync, logoutUser } from './redux/userSlice';

import NavBar from './components/NavBar';
import Login from './pages/Login';
import ResumeList from './pages/ResumeList';
import ResumeDetails from './pages/ResumeDetails';
import ResumeUploadForm from './components/ResumeUploadForm';
import ProtectedRoute from './utils/ProtectedRoute';
import Logout from './components/Logout';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        dispatch(fetchUserDetailsAsync(token as string))
          .unwrap()
          .catch(() => {
            dispatch(logoutUser());
          });
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resumes" element={<ResumeList />} />
        <Route path="/resume/:id" element={<ResumeDetails />} />
        <Route path="/upload" element={<ResumeUploadForm />} />
        {/* <Route path="/resumes" element={<ProtectedRoute element={<ResumesLayout />} />}>
          <Route index element={<ResumeList />} />
          <Route path="resume/:id" element={<ResumeDetails />} />
        </Route> */}
        <Route path="/logout" element={<ProtectedRoute element={<Logout />}/>} />
      </Routes>
    </Router>
  );
};

/* const ResumesLayout = () => {
  return (
    <Outlet />
  );
};
 */
export default App;
