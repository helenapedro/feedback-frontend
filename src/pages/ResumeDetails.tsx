import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { loadResumeDetails } from '../redux/resumeSlice';
import { useParams, Link } from 'react-router-dom';
import Notification from '../utils/Notification';
import useFileDownloader from '../middleware/useFileDownloader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';
import * as styles from 'react-bootstrap';
import ViewerSection from '../components/resumedetails/ViewerSection';
import CommentsSection from '../utils/CommentsSection';

const ResumeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const [notification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const resume = useSelector((state: RootState) => state.resumes.selected);

  const { downloadFile } = useFileDownloader();

  useEffect(() => {
    if (id) dispatch(loadResumeDetails(id));
  }, [id, dispatch]);

  const handleDownloadResume = () => {
    if (resume?.url && resume?.description && resume?.format) {
      downloadFile(resume.url, `${resume.description}.${resume.format}`);
    } else {
      console.error('Resume URL, description, or format is missing.');
    }
  };

  return (
    <styles.Container className="mt-4" style={{ maxWidth: '1200px' }}>
      {notification && <Notification message={notification.message} type={notification.type} />}
      <styles.Row className="mb-4">
        <styles.Col>
          <styles.Card>
            <styles.Card.Header className="d-flex justify-content-between align-items-center">
              <Link to="/resumes">
                <styles.Button variant="secondary" aria-label="Back to Resumes">
                  <FontAwesomeIcon icon={icons.faArrowLeft} />
                </styles.Button>
              </Link>
              {resume?.url && resume?.description && resume?.format && (
                <styles.Button
                  variant="secondary"
                  onClick={handleDownloadResume}
                  aria-label="Download Resume"
                >
                  <FontAwesomeIcon icon={icons.faDownload} />
                </styles.Button>
              )}
            </styles.Card.Header>
            <styles.Card.Body>
              {resume && (
                <>
                  <p>
                    <strong>Uploaded By:</strong> {resume?.posterId?.username || 'N/A'}
                  </p>
                  <p>
                    <strong>Format:</strong> {resume.format}
                  </p>
                  {resume.description && (
                    <p>
                      <strong>Description:</strong> {resume.description}
                    </p>
                  )}
                </>
              )}
            </styles.Card.Body>
          </styles.Card>
        </styles.Col>
      </styles.Row>

      <styles.Row className="mb-4">
        {/* Right Section: Resume Viewer */}
        <styles.Col md={8} className="order-1 order-md-2">
          <ViewerSection
            id={id}
            resume={resume}
            isOwner={false} // Explicitly set isOwner to false
            handleDownloadResume={handleDownloadResume}
            deleteResume={() => {}} // Remove delete functionality
          />
        </styles.Col>
        {/* Left Section: Comments */}
        <styles.Col md={4} className="order-2 order-md-1 border-end">
          <styles.Card>
            <styles.Card.Header className="d-flex align-items-center">
              <FontAwesomeIcon icon={icons.faComments} className="me-2" />
              Feedback
            </styles.Card.Header>
            <styles.Card.Body>
              <CommentsSection id={id || ''} />
            </styles.Card.Body>
          </styles.Card>
        </styles.Col>
      </styles.Row>
    </styles.Container>
  );
};

export default ResumeDetails;