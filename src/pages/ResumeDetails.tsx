import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { loadResumeDetails, updateResumeDescriptionAsync, deleteResumeAsync } from '../redux/resumeSlice';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Container, Form } from 'react-bootstrap';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import ImageViewer from '../components/ImageViewer';
import '@react-pdf-viewer/core/lib/styles/index.css';
import CommentForm from '../forms/CommentForm';
import CommentList from '../forms/CommentList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const ResumeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const resume = useSelector((state: RootState) => state.resumes.selected);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [pageCount, setPageCount] = useState(0);
  const [newDescription, setNewDescription] = useState<string>('');

  const isOwner = currentUser?.id === resume?.posterId._id;

  useEffect(() => {
    if (id) {
      dispatch(loadResumeDetails(id));
    }
  }, [id, dispatch]);

  if (!resume) return <div>No resume found.</div>;

  const isImage = ['jpg', 'jpeg', 'png'].includes(resume.format);

  const handleDescriptionUpdate = () => {
    if (id && newDescription !== resume.description) {
      dispatch(updateResumeDescriptionAsync({ id, description: newDescription }));
    }
  };

  const handleResumeDelete = () => {
    if (id) {
      dispatch(deleteResumeAsync(id)).then(() => {
        navigate('/resumes');
      });
    }
  };

  return (
    <Container style={{ marginTop: '20px' }}>
      <Card style={{ border: '1px solid #e3e6f0', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', width: '100%' }}>
        <Card.Header style={{ backgroundColor: '#f8f9fc', borderBottom: '1px solid #e3e6f0', padding: '15px', textAlign: 'center' }}>
          <Link to={`/resumes`}>
            <Button variant="primary" style={{ marginBottom: '8px' }}>View All Resumes</Button>
          </Link>
        </Card.Header>
        <Card.Body style={{ padding: '20px' }}>
          {isOwner && resume.description && (
            <Form style={{ marginTop: '20px' }}>
              <Form.Group className="mb-3">
                <Form.Label>Update Description</Form.Label>
                <Form.Control
                  type="text"
                  value={newDescription || resume.description}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </Form.Group>
              <Button
                style={{ backgroundColor: '#f6c23e', borderColor: '#f6c23e' }}
                onClick={handleDescriptionUpdate}
                disabled={newDescription === resume.description}
              >
                Update Description
              </Button>
            </Form>
          )}

          {isImage ? (
            <ImageViewer url={resume.url} />
          ) : (
            <div style={{ border: '1px solid #e3e6f0', padding: '15px', backgroundColor: '#ffffff' }}>
              <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js`}>
                <Viewer
                  fileUrl={resume.url}
                  defaultScale={SpecialZoomLevel.PageWidth}
                  onDocumentLoad={(e) => setPageCount(e.doc.numPages)}
                />
              </Worker>
            </div>
          )}
        </Card.Body>
        <div style={{ marginTop: '20px' }}>
          {id && <CommentForm resumeId={id} />}
        </div>
        <div style={{ marginTop: '20px' }}>
          {id && <CommentList resumeId={id} />}
        </div>
        {isOwner && resume.description && (
          <Card.Body className="mt-4 d-flex justify-content-between">
            <Button onClick={handleResumeDelete} variant="danger"> 
              <FontAwesomeIcon icon={faTrash} /> Delete 
            </Button> 
          </Card.Body>
        )}
      </Card>
    </Container>
  );
};

export default ResumeDetails;
