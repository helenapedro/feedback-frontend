import React from 'react';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../redux/userSlice';
import { User } from '../types';
import * as styles from 'react-bootstrap/';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faUserShield, faEdit } from '@fortawesome/free-solid-svg-icons';

const UserDetails = () => {
  const user: User | null = useSelector(selectUserInfo);

  if (!user) {
    return <div>No user details available.</div>;
  }

  return (
    <styles.Container className="mt-5">
      <styles.Card>
        <styles.Card.Header>
          <styles.Card.Title className="text-center">User Details</styles.Card.Title>
        </styles.Card.Header>
        <styles.Card.Body>
          <styles.ListGroup>
            <styles.ListGroupItem>
              <FontAwesomeIcon icon={faUser} className="me-2" />
              <strong>Username:</strong> {user.username}
            </styles.ListGroupItem>
            <styles.ListGroupItem>
              <FontAwesomeIcon icon={faEnvelope} className="me-2" />
              <strong>Email:</strong> {user.email}
            </styles.ListGroupItem>
            <styles.ListGroupItem>
              <FontAwesomeIcon icon={faUserShield} className="me-2" />
              <strong>Admin:</strong> {user.isAdmin ? 'Yes' : 'No'}
            </styles.ListGroupItem>
          </styles.ListGroup>
        </styles.Card.Body>
        <styles.Card.Footer className="text-center">
          <styles.Button variant="primary">
            <FontAwesomeIcon icon={faEdit} className="me-2" />
            Edit Profile
          </styles.Button>
        </styles.Card.Footer>
      </styles.Card>
    </styles.Container>
  );
};

export default UserDetails;
