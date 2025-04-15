import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { loadCurrentUserResume } from '../redux/resumeSlice'; 
import Notification from '../utils/Notification';
import useFileDownloader from '../middleware/useFileDownloader';
import useResumeActions from '../middleware/useResumeActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';
import * as styles from 'react-bootstrap';
import ViewerSection from '../components/resumedetails/ViewerSection'; 
import CommentsSection from '../utils/CommentsSection';
import OwnerDetailForm from '../forms/OwnerDetailForm';

const MyResume: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const resume = useSelector((state: RootState) => state.resumes.currentUserResume); // New selector
  const currentUser = useSelector((state: RootState) => state.user.user);
  const isOwner = true; 

  const { deleteResume } = useResumeActions(resume?._id);
  const { downloadFile } = useFileDownloader();

  useEffect(() => {
    dispatch(loadCurrentUserResume()); 
  }, [dispatch]);

  const handleDownloadResume = () => {
    if (resume?.url && resume?.description && resume?.format) {
      downloadFile(resume.url, `${resume.description}.${resume.format}`);
    } else {
      console.error('Resume URL, description, or format is missing.');
    }
  };

  const handleResumeUpdateSuccess = (message: string) => {
    setNotification({ message, type: 'success' });
    setTimeout(() => setNotification(null), 3000);
    dispatch(loadCurrentUserResume()); // Reload the resume data after update
  };

  return (
    <styles.Container className="mt-4" style={{ maxWidth: '1200px' }}>
      <h2>Manage Your Resume</h2>
      {notification && <Notification message={notification.message} type={notification.type} />}
      <styles.Row className="mb-4">
        <styles.Col>
          <styles.Card>
            <styles.Card.Header className="d-flex justify-content-between align-items-center">
              <span>Your Resume</span>
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
            <OwnerDetailForm
              resumeId={resume?._id || ''}
              resume={resume}
              initialDescription={resume?.description || ''}
              onSuccess={handleResumeUpdateSuccess} 
              isOwner={isOwner}
            />
          </styles.Card>
        </styles.Col>
      </styles.Row>

      <styles.Row className="mb-4">
        {/* Resume Viewer */}
        <styles.Col md={8}>
          <ViewerSection
            id={resume?._id}
            resume={resume}
            isOwner={isOwner}
            handleDownloadResume={handleDownloadResume}
            deleteResume={deleteResume}
          />
        </styles.Col>
        {/* Feedback Section (Optional on this page) */}
        <styles.Col md={4} className="border-end">
          <styles.Card>
            <styles.Card.Header className="d-flex align-items-center">
              <FontAwesomeIcon icon={icons.faComments} className="me-2" />
              Your Feedback
            </styles.Card.Header>
            <styles.Card.Body>
              <CommentsSection id={resume?._id || ''} />
            </styles.Card.Body>
          </styles.Card>
        </styles.Col>
      </styles.Row>
    </styles.Container>
  );
};

export default MyResume;