import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { updateUserAsync, changeUserPassword, deactivateUserAccount } from '../redux/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTrash, faKey, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { Container, Card, Form, Button } from 'react-bootstrap';

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    newPassword: ''
  });

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    setShowChangePassword(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    dispatch(updateUserAsync({ username: formData.username, email: formData.email }));
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    dispatch(changeUserPassword({
      oldPassword: formData.password,
      newPassword: formData.newPassword
    }));
    setFormData({ ...formData, password: '', newPassword: '' });
    setShowChangePassword(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      dispatch(deactivateUserAccount());
    }
  };

  return (
     <Container className="mt-5"> 
          <Card> 
               <Card.Header className="text-center"> 
                    <Card.Title>{formData.username}'s' Profile</Card.Title> 
               </Card.Header> 
               <Card.Body> 
                    <Form> 
                         <Form.Group controlId="formUsername"> 
                              <Form.Label> 
                                   <FontAwesomeIcon icon={faUser} className="me-2" /> Username 
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
                                   <FontAwesomeIcon icon={faEnvelope} className="me-2" /> 
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
                                   <Button variant="link" onClick={() => setShowChangePassword(!showChangePassword)} className="mt-3"> 
                                        <FontAwesomeIcon icon={faKey} /> {showChangePassword ? 'Cancel Password Change' : 'Change Password'} 
                                   </Button> {showChangePassword && ( 
                                        <div className="password-change-section mt-3"> 
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
                                                  className="mt-3"
                                             > 
                                                  <Form.Label>New Password</Form.Label> 
                                                  <Form.Control 
                                                       type="password" 
                                                       name="newPassword" 
                                                       placeholder="New Password" 
                                                       value={formData.newPassword} 
                                                       onChange={handleInputChange} 
                                                  /> 
                                             </Form.Group> 
                                             <Button 
                                                  onClick={handlePasswordChange} 
                                                  variant="warning" 
                                                  className="mt-3"
                                                  > Save New Password 
                                             </Button> 
                                        </div> 
                                   )} 
                              </> 
                         )} 
                         <div className="profile-buttons mt-4 d-flex justify-content-between"> 
                              {isEditing ? ( 
                                   <> 
                                        <Button onClick={handleSaveChanges} variant="success"> 
                                             <FontAwesomeIcon icon={faSave} /> Save Changes 
                                        </Button> 
                                        <Button variant="secondary" onClick={handleToggleEdit}> 
                                             Cancel 
                                        </Button> 
                                   </> 
                                   ) : ( 
                                        <Button onClick={handleToggleEdit} variant="primary"> 
                                             <FontAwesomeIcon icon={faEdit} /> Edit Profile 
                                        </Button> 
                              )} 
                              <Button onClick={handleDeleteAccount} variant="danger"> 
                                   <FontAwesomeIcon icon={faTrash} /> Delete Account 
                              </Button> 
                         </div> 
                    </Form> 
               </Card.Body> 
          </Card> 
     </Container>
  );
};

export default ProfilePage;
