import { logout } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'; 
import { useEffect } from 'react';

const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout());
    localStorage.removeItem('authToken'); 
    navigate("/login");
  }, [dispatch, navigate]);

  return null;
};

export default Logout;
