import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserDetails from './pages/UserDetails';

//import ResumeList from './pages/ResumeList';
/* 
import ResumeDetails from './pages/ResumeDetails';
import ResumeUploadForm from './components/ResumeUploadForm'; */
import Login from './pages/Login';

const App = () => {
  return (
    <div className="app">
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user/:userId" element={<UserDetails />} />
        {/* <Route path="/resumes" element={<ResumeList />} /> */}
        {/* 
        <Route path="/resume/:id" element={<ResumeDetails />} />
        
        <Route path="/upload" element={<ResumeUploadForm />} /> */}
      </Routes>
    </div>
  );
};

export default App;