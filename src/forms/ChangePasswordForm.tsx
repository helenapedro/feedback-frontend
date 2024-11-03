import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeUserPassword } from '../redux/userSlice';
import { AppDispatch } from '../redux/store';
import * as styles from 'react-bootstrap/';

const ChangePassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(changeUserPassword({ oldPassword, newPassword })).unwrap();
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password.');
    }
  };

  return (
    <styles.Form onSubmit={handleSubmit} className="mb-3">
      <styles.Form.Group controlId="formOldPassword">
        <styles.Form.Label>Old Password</styles.Form.Label>
        <styles.Form.Control
          type="password"
          placeholder="Enter old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
      </styles.Form.Group>
      <styles.Form.Group controlId="formNewPassword">
        <styles.Form.Label>New Password</styles.Form.Label>
        <styles.Form.Control
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </styles.Form.Group>
      <styles.Button variant="primary" type="submit">
        Change Password
      </styles.Button>
    </styles.Form>
  );
};

export default ChangePassword;
