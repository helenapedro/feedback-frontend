import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchCommentsAsync, addCommentAsync } from '../redux/commentSlice';
import { loadResumeDetails } from '../redux/resumeSlice';
import { useParams } from 'react-router-dom';
import { Button, Form, Spinner } from 'react-bootstrap';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const ResumeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const resume = useSelector((state: RootState) => state.resumes.selected);
  const comments = useSelector((state: RootState) => state.comments.data);
  const loading = useSelector((state: RootState) => state.comments.loading);
  const error = useSelector((state: RootState) => state.comments.error);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(loadResumeDetails(id));
      dispatch(fetchCommentsAsync(id));
    }
  }, [id, dispatch]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && id) {
      dispatch(addCommentAsync({ resumeId: id, content: commentText }));
      setCommentText('');
    }
  };

  if (!resume) return <div>No resume found.</div>;


  return (
    <div>
      <h2>Resume Details</h2>
      <p><strong>Format:</strong> {resume.format}</p>
      <p><strong>Uploaded At:</strong> {new Date(resume.createdAt).toLocaleString()}</p>

      <h3>Add Comment</h3>
      <Form onSubmit={handleCommentSubmit}>
        <Form.Group controlId="comment">
          <Form.Control
            as="textarea"
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment here..."
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
        </Button>
      </Form>
      {error && <div className="text-danger">{error}</div>}

      <h3>Comments</h3>
      {comments.map((comment) => (
        <div key={comment._id}>{comment.content}</div>
      ))}

      {resume.format === 'pdf' ? (
        <div style={{ height: '750px', border: '1px solid #ccc' }}>
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js`}>
            <Viewer fileUrl={resume.url} />
          </Worker>
        </div>
      ) : (
        <p><strong>URL:</strong> <a href={resume.url} target="_blank" rel="noopener noreferrer">{resume.url}</a></p>
      )}
    </div>
  );
};

export default ResumeDetails;
