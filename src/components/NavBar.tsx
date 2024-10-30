import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { selectIsAuthenticated } from '../redux/userSlice';
import { fetchResumesAsync } from '../redux/resumeSlice';
import { Link } from 'react-router-dom';
import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faBars, faSignIn, faInfoCircle, faUser, faFileAlt, faSignOutAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

function CustomNavbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleSearch = () => {
    dispatch(fetchResumesAsync({ page: 1, limit: 10, format: searchQuery }));
  };

  return (
    <>
      <Navbar bg="primary" expand="lg" variant="dark" className="mb-3">
        <Container fluid>
          <Navbar.Brand as={Link} to={isAuthenticated ? "/resumes" : "/"}>
            <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: '8px' }} /> Resume Feedback
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {!isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to="/about">
                    <FontAwesomeIcon icon={faInfoCircle} /> About
                  </Nav.Link>
                  <Nav.Link as={Link} to="/login">
                    <FontAwesomeIcon icon={faSignIn} /> Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register">
                    <FontAwesomeIcon icon={faUserPlus} /> Register
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/resumes">
                    <FontAwesomeIcon icon={faFilePdf} /> Resumes
                  </Nav.Link>
                  <Nav.Link as={Link} to="/profile">
                    <FontAwesomeIcon icon={faUser} /> Profile
                  </Nav.Link>
                  <Nav.Link as={Link} to="/logout">
                    <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                  </Nav.Link>
                </>
              )}
            </Nav>
            {isAuthenticated && (
              <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                <Form.Control
                  type="search"
                  placeholder="Search by format or date"
                  className="me-2"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline-light" onClick={handleSearch}>Search</Button>
              </Form>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default CustomNavbar;
