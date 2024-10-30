import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { selectIsAuthenticated } from '../redux/userSlice';
import { fetchResumesAsync } from '../redux/resumeSlice';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf,
  faBars,
  faSignIn,
  faInfoCircle,
  faUser,
  faFileAlt,
  faSignOutAlt,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
//import OffcanvasMenu from '../utils/OffcanvasMenu';

function CustomNavbar() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  const handleSearch = () => {
    // Dispatch the search with both format and createdAt as query parameters
    dispatch(fetchResumesAsync({
      page: 1,
      limit: 10,
      format: searchQuery,
      createdAt: searchDate
    }));
  };

  return (
    <>
      <Navbar bg="primary" expand="lg" variant="dark" className="mb-3">
        <Container fluid>
          <Navbar.Brand as={Link} to={isAuthenticated ? "/resumes" : "/"}>
            <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: '8px' }} /> Resume Feedback
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleShow}>
            <FontAwesomeIcon icon={faBars} style={{ color: 'white' }} />
          </Navbar.Toggle>
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
                  type="text"
                  placeholder="Search by format"
                  className="me-2"
                  aria-label="Search by format"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Form.Control
                  type="date"
                  placeholder="Search by date"
                  className="me-2"
                  aria-label="Search by date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                />
                <Button variant="outline-light" onClick={handleSearch}>
                  <FontAwesomeIcon icon={faBars} /> Search
                </Button>
              </Form>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default CustomNavbar;
