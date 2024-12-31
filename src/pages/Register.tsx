import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import RegisterForm from '../forms/registerForm';
import { RootState, AppDispatch } from '../redux/store';
import { Spinner } from 'react-bootstrap';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const loading = useSelector((state: RootState) => state.user.loading);
  const loginError = useSelector((state: RootState) => state.user.error);
  
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
      {loading && <Spinner animation="border" />}
      <RegisterForm
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

export default Register;
