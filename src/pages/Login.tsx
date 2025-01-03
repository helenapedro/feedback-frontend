import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/userSlice';
import LoginForm from '../forms/loginForm';
import { RootState, AppDispatch } from '../redux/store';
import { Spinner } from 'react-bootstrap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
  

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <Spinner animation="border" />}
      <LoginForm
        handleLogin={handleLogin}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
    </div>
  );
};

export default Login;
