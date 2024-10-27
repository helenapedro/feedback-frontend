import React from 'react';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../redux/userSlice';
import { IUser } from '../types';

const UserDetails = () => {
  const user: IUser | null = useSelector(selectUserInfo);

  if (!user) {
    return <div>No user details available.</div>;
  }

  return (
    <div>
      <h2>User Details</h2>
      <ul>
        <li><strong>ID:</strong> {user._id.toString()}</li>
        <li><strong>Username:</strong> {user.username}</li>
        <li><strong>Email:</strong> {user.email}</li>
        {/* <li><strong>Admin:</strong> {user.isAdmin ? 'Yes' : 'No'}</li>
        <li><strong>Created At:</strong> {user.createdAt.toString()}</li>
        <li><strong>Updated At:</strong> {user.updatedAt.toString()}</li> */}
      </ul>
    </div>
  );
};

export default UserDetails;
