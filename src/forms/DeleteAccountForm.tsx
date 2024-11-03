import React from 'react';
import { useDispatch } from 'react-redux';
import { deactivateUserAccount } from '../redux/userSlice';
import { AppDispatch } from '../redux/store';
import * as styles from 'react-bootstrap/';

const DeleteAccount: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmDelete) {
      try {
        await dispatch(deactivateUserAccount()).unwrap();
        alert('Account deleted successfully!');
      } catch (error) {
        console.error('Failed to delete account:', error);
        alert('Failed to delete account.');
      }
    }
  };

  return (
    <styles.Card className="mt-3">
      <styles.Card.Body className="text-center">
        <styles.Button variant="danger" onClick={handleDelete}>
          Delete Account
        </styles.Button>
      </styles.Card.Body>
    </styles.Card>
  );
};

export default DeleteAccount;
