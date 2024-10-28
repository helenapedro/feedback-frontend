import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
//import { useDispatch } from 'react-redux';
//import { fetchUserDetailsAsync } from './redux/userSlice';
//import { logoutUser } from './redux/userSlice';

import NavBar from './components/NavBar';
import Login from './pages/Login';
import ResumeList from './pages/ResumeList';
import ResumeDetails from './pages/ResumeDetails';
//import ProtectedRoute from './utils/ProtectedRoute';
//import UserProfile from './pages/UserProfile';
//import UserDetails from './pages/UserDetails';
//import EditProfile from './pages/EditProfile';

const App: React.FC = () => {
  /* const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch(fetchUserDetailsAsync(userId)).unwrap().catch(() => {
        dispatch(logoutUser());
      });
    }
  }, [dispatch]); */

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resumes" element={<ResumeList />} />
        <Route path="/resume/:id" element={<ResumeDetails />} />
        {/* <Route path="/resumes" element={<ProtectedRoute element={<ResumeList />} />} />
        <Route path="/resume/:id" element={<ProtectedRoute element={<ResumeDetails />} />} /> */}
        {/* <Route path="/profile" element={<ProtectedRoute element={<ProfileLayout />} />}>
          <Route index element={<UserProfile />} />
          <Route path="view" element={<UserDetails />} />
          <Route path="edit" element={<EditProfile />} />
        </Route> */}
      </Routes>
    </Router>
  );
};


/* const ProfileLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
}; */

export default App;
