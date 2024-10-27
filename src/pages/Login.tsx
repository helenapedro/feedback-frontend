import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/userSlice';
import { loginUser, registerUser } from '../api/authApi';
import LoginForm from '../forms/loginForm';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await loginUser(email, password);
      const { token, user } = response.data;
      const TOKEN_KEY = 'authToken'; 

      localStorage.setItem(TOKEN_KEY, token);
      dispatch(login({ userId: user.id, user }));
      navigate('/resumes');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      await registerUser (username, email, password);
      console.log('Registration successful');
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
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
