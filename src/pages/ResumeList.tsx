import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { fetchResumes } from '../services/api';
import { loadResumes, setLoading, setError } from '../redux/resumeSlice'; 
import { Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Worker, Viewer } from '@react-pdf-viewer/core';

const ResumeList = () => {
  const dispatch = useDispatch();
  const { data: resumes = [], loading, error } = useSelector((state: RootState) => state.resumes);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true)); 
      try {
        const resumes = await fetchResumes();
        console.log('Fetched resumes:', resumes);
        dispatch(loadResumes(resumes));
      } catch (err: any) {
        dispatch(setError(err.message)); 
        console.error('Error fetching resumes:', err);
      } finally {
        dispatch(setLoading(false)); 
      }
    };
    fetchData();
  }, [dispatch]);

  console.log('Resumes from state:', resumes);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div>Error fetching resumes: {error}</div>;
  }

  return (
    <div className="resume-list">
      {resumes.length === 0 ? (
        <p>No resumes found.</p>
      ) : (
        resumes.map((resume) => (
          <Card key={resume._id.toString()} className="mb-3"> 
            <Card.Body>
              <Card.Title>{resume.format.toUpperCase()} Resume</Card.Title>
              <Card.Text>
                <strong>Uploaded At:</strong> {new Date(resume.createdAt).toLocaleString()}
              </Card.Text>
              {resume.format === 'pdf' ? (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                  <Viewer fileUrl={resume.url} />
                </Worker>
              
              ) : (
                <img src={resume.url} alt="Resume Preview" style={{ maxWidth: '100%' }} />
              )}
              <Link to={`/resume/${resume._id}`}>
                <Button variant="primary">View Details</Button>
              </Link>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default ResumeList;
