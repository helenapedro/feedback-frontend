import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { fetchResumes } from '../services/api';
import { loadResumes } from '../redux/resumeSlice'; 
import { Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ResumeList = () => {
  const dispatch = useDispatch();
  const { data: resumes, loading, error } = useSelector((state: RootState) => state.resumes);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchResumes();
        dispatch(loadResumes(response.data));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [dispatch]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div>Error fetching resumes: {error}</div>;
  }

  return (
    <div className="resume-list">
      {resumes.map((resume) => (
        <Card key={resume._id.toString()} className="mb-3"> {/* Convert ObjectId to string */}
          <Card.Body>
            <Card.Title>{resume.format.toUpperCase()} Resume</Card.Title>
            <Card.Text>
              <strong>Uploaded At:</strong> {new Date(resume.createdAt).toLocaleString()}
            </Card.Text>
            <Link to={`/resume/${resume._id}`}>
              <Button variant="primary">View Details</Button>
            </Link>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default ResumeList;
