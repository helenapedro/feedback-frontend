import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { loadResumeDetails, deleteResumeAsync } from '../redux/resumeSlice';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Container, Col, Row } from 'react-bootstrap';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import ImageViewer from '../components/ImageViewer';
import '@react-pdf-viewer/core/lib/styles/index.css';
import CommentForm from '../forms/CommentForm';
import CommentList from '../forms/CommentList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import ResumeDetailsForm from '../forms/ResumeDetailsForm';

const ResumeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const resume = useSelector((state: RootState) => state.resumes.selected);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const isOwner = currentUser?.id === resume?.posterId._id;

  useEffect(() => {
    if (id) dispatch(loadResumeDetails(id));
  }, [id, dispatch]);

  const handleResumeDelete = () => {
    if (id) {
      const userConfirmed = window.confirm(
        'Are you sure you want to delete this resume? This action cannot be undone.'
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
      console.error('Resume URL is undefined.');
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
                <ResumeDetailsForm
                  resumeId={id!}
                  initialDescription={resume.description}
                  onSuccess={() => window.location.reload()}
                />
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
          <div className="mt-4">{id && <CommentList resumeId={id} />}</div>
        </Col>
      </Row>
    </Container>
  );
};

export default ResumeDetails;
