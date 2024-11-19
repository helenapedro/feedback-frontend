import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Container, Card } from 'react-bootstrap';
import ProfilePageForm from '../forms/ProfilePageForm';

const ProfilePage: React.FC = () => {
     const user = useSelector((state: RootState) => state.user.user);
     const [isEditing, setIsEditing] = useState(false);
     const [error, setError] = useState('');
     const [success, setSuccess] = useState('');
     const [showChangePassword, setShowChangePassword] = useState(false);
     const [formData, setFormData] = useState({
          username: user?.username || '',
          email: user?.email || '',
          password: '',
          newPassword: ''
     });

     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target;
          setFormData(prev => ({ ...prev, [name]: value }));
     };

     return (
          <Container className="mt-5" style={{ maxWidth: '700px', margin: '0 auto', borderRadius: '8px' }}>
               {error && <div className="alert alert-danger">{error}</div>}
               {success && <div className="alert alert-success">{success}</div>}
               <Card>
                    <Card.Header className="text-center" as="h3" style={{ backgroundColor: '#007bff', color: '#fff', borderRadius: '8px 8px 0 0' }}>
                         <Card.Title>Profile</Card.Title>
                    </Card.Header>
               <Card.Body>
                    <ProfilePageForm 
                         formData={formData}
                         setFormData={setFormData}
                         handleInputChange={handleInputChange}
                         isEditing={isEditing}
                         setIsEditing={setIsEditing}
                         setSuccess={setSuccess}
                         setError={setError}
                         showChangePassword={showChangePassword}
                         setShowChangePassword={setShowChangePassword}
                    />    
               </Card.Body>
               </Card>
          </Container>
     );
};

export default ProfilePage;
