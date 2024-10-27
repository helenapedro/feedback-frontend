import React, { useState } from 'react';
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBBtn,
  MDBInput,
} from 'mdb-react-ui-kit';

interface ILoginFormProps {
  handleLogin: (email: string, password: string) => void;
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

const LoginForm: React.FC<ILoginFormProps> = ({
  handleLogin, handleRegister,
  email, setEmail,
  password, setPassword,
  username, setUsername,
  confirmPassword, setConfirmPassword,
}) => {
  const [justifyActive, setJustifyActive] = useState('tab1');

  const handleJustifyClick = (value: string) => {
    if (value === justifyActive) return;
    setJustifyActive(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (justifyActive === 'tab1') {
      handleLogin(email, password);
    } else {
      if (password !== confirmPassword) {
        console.error('Passwords do not match');
        return;
      }
      handleRegister(username, email, password);
    }
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <MDBTabs pills justify className="mb-3 d-flex flex-row justify-content-between">
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
            Login
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
            Register
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        {justifyActive === 'tab1' && (
          <div>
            <form onSubmit={handleSubmit}>
              <MDBInput
                wrapperClass="mb-4"
                label="Email address"
                id="form1"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="form2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <MDBBtn type="submit" className="mb-4 w-100">
                Sign in
              </MDBBtn>
            </form>
          </div>
        )}

        {justifyActive === 'tab2' && (
          <div>
            <form onSubmit={handleSubmit}>
              <MDBInput
                wrapperClass="mb-4"
                label="Username"
                id="form4"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Email"
                id="form5"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="form6"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Confirm Password"
                id="form7"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <MDBBtn type="submit" className="mb-4 w-100">
                Sign up
              </MDBBtn>
            </form>
          </div>
        )}
      </MDBTabsContent>
    </MDBContainer>
  );
};

export default LoginForm;
