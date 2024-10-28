import { logoutUser } from "../redux/userSlice";
import { connect, ConnectedProps } from "react-redux";
import { useNavigate } from 'react-router-dom'; 
import { useEffect } from 'react';
import { Action } from 'redux';

const mapDispatchToProps = (dispatch: (action: Action) => void) => ({
  logoutUser: () => dispatch(logoutUser()),
});

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const Logout: React.FC<PropsFromRedux> = ({ logoutUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [logoutUser, navigate]);

  return null;
};

export default connector(Logout);
