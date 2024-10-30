import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchCommentsAsync, addCommentAsync } from '../redux/commentSlice';
import { loadResumeDetails } from '../redux/resumeSlice';
import { Link, useParams } from 'react-router-dom';
import { Card, Button, Form, Spinner } from 'react-bootstrap';
import { Worker, Viewer, PageLayout, Rect, SpecialZoomLevel } from '@react-pdf-viewer/core';
import ImageViewer from '../components/ImageViewer';
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
      await dispatch(addCommentAsync({ resumeId: id, content: commentText }));
      dispatch(fetchCommentsAsync(id)); // Fetch comments after adding a new one
      setCommentText('');
    }
  };

  const pageLayout: PageLayout = {
    buildPageStyles: ({ pageIndex }) => ({
      display: pageIndex < 5 ? 'block' : 'none',
      margin: 0,
      padding: 0,
    }),
    transformSize: ({ pageIndex, size }: { pageIndex: number; size: Rect }) => {
      return pageIndex < 5
        ? size
        : { height: size.height * 0.8, width: size.width * 0.8 };
    },
  };

  if (!resume) return <div>No resume found.</div>;

  const isImage = ['jpg', 'jpeg', 'png'].includes(resume.format);

  return (
    <Card>
      <Card.Body>
        <Link to={`/resume/${resume._id}`}>
          <Button variant="primary" style={{ marginBottom: '8px' }}>
            {resume.format.toUpperCase()} Resume Details
          </Button>
        </Link>
        {isImage ? (
          <ImageViewer url={resume.url} />
        ) : (
          <div style={{ height: '750px', border: '1px solid #ccc', marginTop: '20px' }}>
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js`}>
              <Viewer
                fileUrl={resume.url}
                defaultScale={SpecialZoomLevel.PageFit}
                pageLayout={pageLayout}
              />
            </Worker>
          </div>
        )}
        <Card.Title style={{ marginTop: '1rem' }}>Add Comment</Card.Title>
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
          <Button variant="primary" type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
          </Button>
        </Form>
        {error && <div className="text-danger">{error}</div>}
      </Card.Body>
      <Card.Footer>
        <Card.Title style={{ marginTop: '1rem' }}>Comments</Card.Title>
        {comments && comments.length > 0 ? (
          <ul className="list-unstyled">
            {comments.map((comment) => (
              <li key={comment._id} className="media my-3">
                <img
                  src={`https://www.gravatar.com/avatar/${comment.commenterId}?d=identicon`} // Example avatar
                  className="mr-3"
                  alt="avatar"
                  style={{ width: '50px', borderRadius: '50%' }}
                />
                <div className="media-body">
                  <h5 className="mt-0 mb-1">{comment.user?.username}</h5> {/* Access username */}
                  <p>{comment.content}</p>
                  <small className="text-muted">{new Date(comment.createdAt).toLocaleString()}</small>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments available.</p>
        )}
      </Card.Footer>
    </Card>
  );
};

export default ResumeDetails;
