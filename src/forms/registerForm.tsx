import React, { useState } from 'react';
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBInput,
} from 'mdb-react-ui-kit';

interface IRegisterFormProps {
  handleRegister: (username: string, email: string, password: string) => void;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
}

const RegisterForm: React.FC<IRegisterFormProps> = ({
  handleRegister,
  email, setEmail,
  password, setPassword,
  username, setUsername,
  confirmPassword, setConfirmPassword,
}) => {
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    handleRegister(username, email, password);
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <MDBTabs pills justify className="mb-3 d-flex flex-row justify-content-between">
        <MDBTabsItem>
          <MDBTabsLink active>
            Register
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>
      <MDBTabsContent>
        <form onSubmit={handleSubmit}>
          <MDBInput
            wrapperClass="mb-4"
            label="Username"
            id="form-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Email address"
            id="form-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Password"
            id="form-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Confirm Password"
            id="form-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
      </MDBTabsContent>
    </MDBContainer>
  );
};

export default RegisterForm;