import React from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

interface OffcanvasMenuProps {
  show: boolean;
  handleClose: () => void;
}

const OffcanvasMenu: React.FC<OffcanvasMenuProps> = ({ show, handleClose }) => {
  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="end"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Menu</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav className="justify-content-end flex-grow-1 pe-3">
          <Nav.Link as={Link} to="/resumes">Resumes</Nav.Link>
          <Nav.Link as={Link} to="/profile">
            <FontAwesomeIcon icon={faUser} /> Profile
          </Nav.Link>
          <Nav.Link as={Link} to="/logout">
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </Nav.Link>
        </Nav>
        <Form className="d-flex mt-4">
          <Form.Control
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
          />
          <Button variant="outline-light">Search</Button>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default OffcanvasMenu;
