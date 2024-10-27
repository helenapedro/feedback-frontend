import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { fetchResumeDetails, addComment } from '../services/api'; 
import { useParams } from 'react-router-dom';
import { Button, Form, Spinner } from 'react-bootstrap';
import { loadResumeDetails } from '../redux/resumeSlice'; 
import { IResume } from '../types';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const ResumeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const resume = useSelector((state: RootState) => state.resumes.selected) as IResume;
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchResumeDetails(id!);
        dispatch(loadResumeDetails(response.data));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load resume details');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resume) {
      try {
        await addComment(resume._id.toString(), comment);
        setComment('');
      } catch (err) {
        console.error(err);
        setError('Failed to add comment');
      }
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!resume) {
    return <div>No resume found.</div>;
  }

  return (
    <div>
      <h2>Resume Details</h2>
      <p><strong>Format:</strong> {resume.format}</p>
      <p><strong>Uploaded At:</strong> {new Date(resume.createdAt).toLocaleString()}</p>
      
      {resume.format === 'pdf' ? (
        <div style={{ height: '750px', border: '1px solid #ccc' }}>
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js`}>
            <Viewer fileUrl={resume.url} />
          </Worker>
        </div>
      ) : (
        <p><strong>URL:</strong> <a href={resume.url} target="_blank" rel="noopener noreferrer">{resume.url}</a></p>
      )}

      <h3>Add Comment</h3>
      <Form onSubmit={handleCommentSubmit}>
        <Form.Group controlId="comment">
          <Form.Control
            as="textarea"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here..."
          />
        </Form.Group>
        <Button variant="primary" type="submit">Submit</Button>
      </Form>
    </div>
  );
};

export default ResumeDetails;
