import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchResumesAsync } from '../redux/resumeSlice';
import { Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Worker, Viewer, VisiblePagesRange } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const ResumeList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: resumesData, loading, error } = useSelector((state: RootState) => state.resumes);
  
  useEffect(() => {
    dispatch(fetchResumesAsync());
  }, [dispatch]);
  
  console.log('Current resumes:', resumesData); 

  const resumes = resumesData?.resumes || []; 

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
              <Link to={`/resume/${resume._id}`}>
                <Button variant="primary">View Details</Button>
              </Link>
              {resume.format === 'pdf' ? (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
                  <Viewer 
                    fileUrl={resume.url} 
                    setRenderRange={(visiblePagesRange: VisiblePagesRange)=>{return {endPage:0, startPage:0}}} 
                  />
                </Worker>
              
              ) : (
                <img src={resume.url} alt="Resume Preview" style={{ maxWidth: '100%' }} />
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default ResumeList;
