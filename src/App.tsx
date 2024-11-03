// App.tsx
import React, { useEffect } from 'react';
import { AppDispatch, RootState } from './redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import ResumeList from './pages/ResumeList';
import ResumeDetails from './pages/ResumeDetails';
import ResumeUploadForm from './components/ResumeUploadForm';
import ProtectedRoute from './utils/ProtectedRoute';
import UserDetails from './pages/UserDetails';
import Logout from './components/Logout';
import { fetchUser, logout } from './redux/userSlice';
import EditProfile from './forms/EditProfileForm';
import ChangePassword from './forms/ChangePasswordForm';
import DeleteAccount from './forms/DeleteAccountForm';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = localStorage.getItem('authToken');
  const userId = useSelector((state: RootState) => state.user.user?._id);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken: { userId: string; exp: number } = jwtDecode(token);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();

        if (isTokenExpired) {
          dispatch(logout());
        } else {
          dispatch(fetchUser()).catch(() => {
            dispatch(logout());
          });
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        dispatch(logout());
      }
    }
  }, [dispatch, token, userId]);

  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />

        {/* Protected routes */}
        <Route path="/resumes" element={<ProtectedRoute element={<ResumesLayout />} />}>
          <Route index element={<ResumeList />} />
          <Route path=":id" element={<ResumeDetails />} />
          <Route path="upload" element={<ResumeUploadForm />} />
        </Route>

        <Route path="/profile" element={<ProtectedRoute element={<ProfileLayout />} />}>
          <Route index element={<ProfilePage />} />
        </Route>
        <Route path="/logout" element={<ProtectedRoute element={<Logout />} />} />
      </Routes>
    </Router>
  );
};

const ResumesLayout = () => <Outlet />;
const ProfileLayout = () => <Outlet />;

export default App;
