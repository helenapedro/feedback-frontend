import React, { useEffect } from 'react';
import { UseDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { logoutUser } from './redux/userSlice';

import NavBar from './components/NavBar';
import Login from './pages/Login';
import ResumeList from './pages/ResumeList';
import ResumeDetails from './pages/ResumeDetails';

//import UserDetails from './pages/UserDetails';
//import ResumeUploadForm from './components/ResumeUploadForm';

const App = () => {
  return (
    <div className="app">
      <NavBar />
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resumes" element={<ResumeList />} />
        <Route path="/resume/:id" element={<ResumeDetails />} />
        {/* <Route path="/user/:userId" element={<UserDetails />} /> */}
        {/* <Route path="/upload" element={<ResumeUploadForm />} /> */}
      </Routes>
    </div>
  );
};

export default App;