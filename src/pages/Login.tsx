import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import { login } from '../redux/userSlice';
import LoginForm from '../forms/loginForm';
import { RootState, AppDispatch } from '../redux/store';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const loading = useSelector((state: RootState) => state.user.loading);
  const loginError = useSelector((state: RootState) => state.user.error);

  const handleLogin = async (email: string, password: string) => {
    setError('');
  
    try {
      const resultAction = await dispatch(login({ email, password })).unwrap();
      
      if (resultAction.user) {
        navigate('/resumes'); 
      }
    } catch (error) {
      console.error('Login error:', loginError);
      setError(error as string || 'Authentication failed. Please check your email and password.');
    }
  };
  
  const handleRegister = async (username: string, email: string, password: string) => {
    setError('');
    try {
      await registerUser(username, email, password);
      console.log('Registration successful');
      navigate('/resumes');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('Registration error:', errorMessage);
    }
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-info">Loading...</div>}
      <LoginForm
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        username={username}
        setUsername={setUsername}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
      />
    </div>
  );
};

export default Login;
