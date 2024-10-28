import React, { useEffect } from 'react';
import { AppDispatch } from './redux/store';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { fetchUserDetailsAsync } from './redux/userSlice';
import { logoutUser } from './redux/userSlice';

import NavBar from './components/NavBar';
import Login from './pages/Login';
import ResumeList from './pages/ResumeList';
import ResumeDetails from './pages/ResumeDetails';
/* import UserProfile from './pages/UserProfile';
import UserDetails from './pages/UserDetails';
import EditProfile from './pages/EditProfile'; */
import ProtectedRoute from './utils/ProtectedRoute';

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
        <Route path="/resumes" element={<ProtectedRoute element={<ResumesLayout />} />}>
          <Route path="" element={<ResumeList />} />
          <Route path="resume/:id" element={<ResumeDetails />} />
        </Route>
       {/*  <Route path="/profile" element={<ProtectedRoute element={<ProfileLayout />} />}>
          <Route index element={<UserProfile />} />
          <Route path="view" element={<UserDetails />} />
          <Route path="edit" element={<EditProfile />} />
        </Route> */}
      </Routes>
    </Router>
  );
};


const ResumesLayout = () => {
  return (
      <Outlet />
  );
};

/* const ProfileLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};
 */
export default App;
