import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { loadResumeDetails, updateResumeDescriptionAsync, deleteResumeAsync } from '../redux/resumeSlice';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Container, Form, Col, Row } from 'react-bootstrap';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import ImageViewer from '../components/ImageViewer';
import '@react-pdf-viewer/core/lib/styles/index.css';
import CommentForm from '../forms/CommentForm';
import CommentList from '../forms/CommentList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';

const ResumeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [newDescription, setNewDescription] = useState<string>('');
  const [pageCount, setPageCount] = useState(0);

  const resume = useSelector((state: RootState) => state.resumes.selected);
  const currentUser = useSelector((state: RootState) => state.user.user);

  const isOwner = currentUser?.id === resume?.posterId._id;

  useEffect(() => {
    if (id) dispatch(loadResumeDetails(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (resume) setNewDescription(resume.description || '');
  }, [resume]);

  const handleDescriptionUpdate = async () => {
    if (!id || newDescription.trim() === resume?.description) {
      setIsEditing(false);
      return;
    }

    try {
      const actionResult = await dispatch(
        updateResumeDescriptionAsync({ id, description: newDescription.trim() })
      );

      if (updateResumeDescriptionAsync.fulfilled.match(actionResult)) {
        setNotification({ message: 'Resume description updated successfully.', type: 'success' });
        window.location.reload();
      } else {
        setNotification({ message: 'Failed to update description.', type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setIsEditing(false);
    }
  };

  const handleResumeDelete = () => {
    if (id) {
      const userConfirmed = window.confirm(
        "Are you sure you want to delete this resume? This action cannot be undone."
      );
  
      if (userConfirmed) {
        dispatch(deleteResumeAsync(id)).then(() => {
          navigate('/resumes');
        });
      }
    }
  };
  

  const handleDownloadResume = () => {
    if (!resume?.url) {
      console.error("Resume URL is undefined.");
      return;
    }

    const link = document.createElement('a');
    link.href = resume?.url;
    link.download = `${resume?.description}.${resume?.format}`;
    link.click();
  };

  if (!resume) return <div>No resume found.</div>;

  const isImage = ['jpg', 'jpeg', 'png'].includes(resume.format);

  return (
    <Container className="mt-4" style={{ maxWidth: '1200px' }}>
      {notification && (
        <div className={`alert alert-${notification.type === 'success' ? 'success' : 'danger'}`}>
          {notification.message}
        </div>
      )}
      <Row>
        {/* Right Section: Resume Viewer (displayed first on small screens) */}
        <Col md={8} className="order-1 order-md-2">
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between">
              <Link to="/resumes">
                <Button variant="secondary">
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Button>
              </Link>
              <Button variant="secondary" onClick={handleDownloadResume}>
                <FontAwesomeIcon icon={faDownload} />
              </Button>
            </Card.Header>
            <Card.Body>
              <Card.Title>{resume.description}</Card.Title>

              {isOwner && (
                <Form className="mt-3">
                  <Form.Group>
                    <Form.Label>Update Description</Form.Label>
                    <Form.Control
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      disabled={isEditing}
                    />
                  </Form.Group>
                  <Button
                    className="mt-2"
                    variant="warning"
                    onClick={handleDescriptionUpdate}
                    disabled={newDescription === resume.description || isEditing}
                  >
                    Update
                  </Button>
                </Form>
              )}

              <div className="mt-3">
                {isImage ? (
                  <ImageViewer url={resume.url} />
                ) : (
                  <div style={{ border: '1px solid #e3e6f0', padding: '15px', backgroundColor: '#ffffff' }}>
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
                      <Viewer
                        fileUrl={resume.url}
                        defaultScale={SpecialZoomLevel.PageWidth}
                        onDocumentLoad={(e) => setPageCount(e.doc.numPages)}
                      />
                    </Worker>
                  </div>
                )}
              </div>
            </Card.Body>
            {isOwner && (
              <Card.Footer>
                <Button variant="danger" onClick={handleResumeDelete}>
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </Button>
              </Card.Footer>
            )}
          </Card>
        </Col>

        {/* Left Section: Comments */}
        <Col md={4} className="order-2 order-md-1 border-end">
          <h5 className="mb-3">Comments</h5>
          {id && <CommentForm resumeId={id} />}
          <div className="mt-4">
            {id && <CommentList resumeId={id} />}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ResumeDetails;
