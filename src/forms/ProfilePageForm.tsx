import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { changeUserPassword, deactivateUserAccount, updateUserAsync } from '../redux/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';
import { Form, Button, Col } from 'react-bootstrap';


interface ProfilePageFormProps {
     formData: {
          username: string;
          email: string;
          password: string;
          newPassword: string;
     };
     setFormData: React.Dispatch<React.SetStateAction<{
          username: string;
          email: string;
          password: string;
          newPassword: string;
     }>>;
     handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
     isEditing: boolean;
     setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
     setSuccess: React.Dispatch<React.SetStateAction<string>>;
     setError: React.Dispatch<React.SetStateAction<string>>;
     showChangePassword: boolean;
     setShowChangePassword: React.Dispatch<React.SetStateAction<boolean>>;

}

const ProfilePageForm: React.FC<ProfilePageFormProps> = ({ 
     formData, 
     setFormData,
     handleInputChange,
     isEditing ,
     setIsEditing,
     setSuccess,
     setError,
     showChangePassword,
     setShowChangePassword,
}) => {
     const dispatch = useDispatch<AppDispatch>();

     const handleToggleEdit = () => {
          setIsEditing(!isEditing);
          setShowChangePassword(false);
     };

     const handleSaveChanges = async () => {
          setError('');
          setSuccess('');
          try {
               const result = await dispatch(updateUserAsync({ username: formData.username, email: formData.email })).unwrap();
               if (result) {
                    setSuccess('Profile updated successfully.');
                    window.location.reload();
               }
               setIsEditing(false);
          } catch (error: any) {
               const errorMessage = error.response?.data?.message || 'Profile update failed.';
               setError(errorMessage);
               console.error('Update profile error:', error);
          }
     };
     
     const handlePasswordChange = async () => {
          setError('');
          setSuccess('');
          try {
               await dispatch(changeUserPassword({
                    oldPassword: formData.password,
                    newPassword: formData.newPassword
               })).unwrap();
               
               setSuccess('Password changed successfully.');
               setFormData({ ...formData, password: '', newPassword: '' });
               setShowChangePassword(false);
          } catch (error: any) {
               const errorMessage = error as string || 'Password change failed. Please try again.';
               setError(errorMessage);
               console.error('Change password error:', errorMessage);
          }
     };

     const handleDeleteAccount = async () => {
          if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
               try {
                    await dispatch(deactivateUserAccount()).unwrap();
                    setSuccess('Account deactivated successfully.');
               } catch (error: any) {
                    const errorMessage = error.response?.data?.message || 'Account deactivation failed. Please try again.';
                    setError(errorMessage);
                    console.error('Deactivate account error:', errorMessage);
               }
          }
     };

     return (
          <Form>
               <Form.Group controlId="formUsername">
                    <Form.Label>
                         <FontAwesomeIcon icon={icons.faUser} className="me-2" /> Username
                    </Form.Label>
                    <Form.Control
                         type="text"
                         placeholder="Enter username"
                         name="username" value={formData.username}
                         onChange={handleInputChange}
                         disabled={!isEditing}
                    />
               </Form.Group>
               <Form.Group controlId="formEmail" className="mt-3">
                    <Form.Label>
                         <FontAwesomeIcon icon={icons.faEnvelope} className="me-2" />
                         Email
                    </Form.Label>
                    <Form.Control
                         type="email"
                         placeholder="Enter email"
                         name="email"
                         value={formData.email}
                         onChange={handleInputChange}
                         disabled={!isEditing}
                    />
               </Form.Group>
               {isEditing && (
                    <>
                         <Button 
                              variant="link" 
                              onClick={() => setShowChangePassword(!showChangePassword)} 
                              className="mt-3">
                              <FontAwesomeIcon icon={icons.faKey} /> {showChangePassword ? 'Cancel' : 'Change Password'}
                         </Button> {showChangePassword && (
                         <Col className="password-change-section mt-3">
                              <Form.Group controlId="formCurrentPassword">
                                   <Form.Label>Current Password</Form.Label>
                                   <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Current Password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                   />
                              </Form.Group>
                              <Form.Group
                                   controlId="formNewPassword"
                                   className="mt-3">
                                   <Form.Label>New Password</Form.Label>
                                   <Form.Control
                                        type="password"
                                        name="newPassword"
                                        placeholder="New Password"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                   />
                              </Form.Group>
                              <Button onClick={handlePasswordChange} variant="warning" className="mt-3"> Save </Button>
                         </Col>
                         )}
                    </>
               )}
               <Col className="mt-4 d-flex justify-content-between">
                    {isEditing ? (
                         <>
                              <Button onClick={handleSaveChanges} variant="success" style={{ marginRight: '8px' }}>
                                   <FontAwesomeIcon icon={icons.faSave} /> Save
                              </Button>
                              <Button variant="secondary" onClick={handleToggleEdit} style={{ marginRight: '8px' }}>
                                   Cancel
                              </Button>
                         </>
                         ) : (
                              <Button onClick={handleToggleEdit} variant="primary">
                                   <FontAwesomeIcon icon={icons.faEdit} /> Edit
                              </Button>
                    )}
                    <Button onClick={handleDeleteAccount} variant="danger">
                         <FontAwesomeIcon icon={icons.faTrash} /> Delete
                    </Button>
               </Col>
          </Form>
     );

}

export default ProfilePageForm;
