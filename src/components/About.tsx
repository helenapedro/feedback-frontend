import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faUsers, faKey } from '@fortawesome/free-solid-svg-icons';
import { Container } from 'react-bootstrap';

const About = () => {
  return (
     <Container>
          <Card className="text-center mt-4 p-4 shadow" style={{ maxWidth: '600px', margin: '0 auto', borderRadius: '8px' }}>
               <Card.Header as="h3" style={{ backgroundColor: '#007bff', color: '#fff', borderRadius: '8px 8px 0 0' }}>
               About This Application
               </Card.Header>
               <Card.Body>
               <Card.Text>
                    Welcome to <strong>Resume Feedback</strong>, a collaborative web application 
                    where job seekers can give and receive valuable feedback on their resumes! 
                    Designed for those who want honest, constructive insights from peers, Resume Feedback 
                    empowers users to fine-tune their resumes through community-driven feedback.
               </Card.Text>
               <hr />
               
               <Card.Text as="h5" className="mt-4">Key Features</Card.Text>
               <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                    Exchange feedback on layout, content, and formatting to help each other present a polished, professional resume.
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faUsers} className="mr-2" />
                    Gain insights from peers in various industries, offering diverse perspectives on highlighting key skills and achievements.
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faKey} className="mr-2" />
                    Improve keyword usage and phrasing, benefiting from feedback on readability and ATS optimization.
                    </ListGroup.Item>
               </ListGroup>
               
               <Card.Text className="mt-4">
                    Join Resume Feedback today, and start giving and receiving the feedback that makes a difference!
               </Card.Text>

               <hr />

               <Card.Text as="h5" className="mt-4">Login Information for Testing</Card.Text>
               <div className="p-3 bg-light rounded mb-3">
                    <ListGroup variant="flush">
                    <ListGroup.Item>
                    <strong>Email:</strong> feedback@mtcambrosio.com
                    </ListGroup.Item>
                    <ListGroup.Item>
                    <strong>Password:</strong> Feedback4321
                    </ListGroup.Item>
                    </ListGroup>
               </div>
               <Button variant="primary" href="/login" className="mb-3">Go to Login</Button>
               <Card.Text>
                    If you're only here for testing, feel free to use the credentials above. 
                    However, if you'd like to create your own account, you're welcome to sign up.
               </Card.Text>

               <hr />

               <Card.Text className="mt-4">
                    For any support inquiries, please send an email to 
                    <a href="mailto:feedback@mtcambrosio.com"> feedback@mtcambrosio.com</a>.
               </Card.Text>
               </Card.Body>
          </Card>
     </Container>
  );
};

export default About;
