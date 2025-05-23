import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as style from 'react-bootstrap/';
import * as icon from '@fortawesome/free-solid-svg-icons';
import { RootState } from '../redux/store';

function CustomNavbar() {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <style.Navbar bg="primary" expand="lg" variant="dark" className="mb-3">
        <style.Container fluid>
          <style.Navbar.Brand as={Link} to={isLoggedIn ? "/resumes" : "/"}>
            <FontAwesomeIcon icon={icon.faFileAlt} style={{ marginRight: '8px' }} /> Resume Feedback
          </style.Navbar.Brand>
          <style.Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleShow}>
            <FontAwesomeIcon icon={icon.faBars} style={{ color: 'white' }} />
          </style.Navbar.Toggle>
          <style.Navbar.Collapse id="basic-navbar-nav">
            <style.Nav className="ms-auto">
              {!isLoggedIn ? (
                <>
                  <style.Nav.Link as={Link} to="/about">
                    <FontAwesomeIcon icon={icon.faInfoCircle} /> About
                  </style.Nav.Link>
                  <style.Nav.Link as={Link} to="/login">
                    <FontAwesomeIcon icon={icon.faSignIn} /> Login
                  </style.Nav.Link>
                  <style.Nav.Link as={Link} to="/register">
                    <FontAwesomeIcon icon={icon.faUserPlus} /> Register
                  </style.Nav.Link>
                </>
              ) : (
                <>
                  <style.Nav.Link as={Link} to="/resumes">
                    <FontAwesomeIcon icon={icon.faFilePdf} /> Resumes
                  </style.Nav.Link>

                  <style.NavDropdown title={<span>Settings <FontAwesomeIcon icon={icon.faCog} /></span>} id="navbarScrollingDropdown">
                    <style.NavDropdown.Item as={Link} to="/profile">
                      <FontAwesomeIcon icon={icon.faUser} /> Profile
                    </style.NavDropdown.Item>
                    <style.NavDropdown.Item as={Link} to="/resumes/my-resume">
                      <FontAwesomeIcon icon={icon.faFileAlt} /> My Resume
                    </style.NavDropdown.Item>
                    <style.NavDropdown.Item as={Link} to="/logout">
                      <FontAwesomeIcon icon={icon.faSignOutAlt} /> Logout
                    </style.NavDropdown.Item>
                  </style.NavDropdown>
                </>
              )}
            </style.Nav>
          </style.Navbar.Collapse>
        </style.Container>
      </style.Navbar>
    </>
  );
}

export default CustomNavbar;
