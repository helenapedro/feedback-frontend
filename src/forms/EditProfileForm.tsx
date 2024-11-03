import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '../types';
import { selectUserInfo } from '../redux/userSlice';
import ChangePassword from './ChangePasswordForm';
import DeleteAccount from './DeleteAccountForm';
import { fetchUser, updateUserAsync } from '../redux/userSlice';
import * as styles from 'react-bootstrap/';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { AppDispatch } from '../redux/store';

const EditProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user: User | null = useSelector(selectUserInfo);
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(updateUserAsync(formData)).unwrap();
      dispatch(fetchUser());
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <styles.Container className="mt-5">
      <styles.Card>
        <styles.Card.Header className="text-center">
          <styles.Card.Title>Edit Profile</styles.Card.Title>
        </styles.Card.Header>
        <styles.Card.Body>
          <styles.Form onSubmit={handleSubmit}>
            <styles.Form.Group controlId="formUsername">
              <styles.Form.Label>
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Username
              </styles.Form.Label>
              <styles.Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                value={formData.username || ''}
                onChange={handleChange}
              />
            </styles.Form.Group>

            <styles.Form.Group controlId="formEmail">
              <styles.Form.Label>
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                Email
              </styles.Form.Label>
              <styles.Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
              />
            </styles.Form.Group>

            <styles.Button variant="primary" type="submit" className="w-100">
              <FontAwesomeIcon icon={faSave} className="me-2" />
              Save Changes
            </styles.Button>
          </styles.Form>
        </styles.Card.Body>
      </styles.Card>
    </styles.Container>
  );
};

export default EditProfile;
