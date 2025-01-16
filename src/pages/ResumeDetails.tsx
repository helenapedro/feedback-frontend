import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { loadResumeDetails } from '../redux/resumeSlice';
import { useParams } from 'react-router-dom';
import Notification from '../utils/Notification';
import useFileDownloader from '../middleware/useFileDownloader';
import useResumeActions from '../middleware/useResumeActions';
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
  const currentUser = useSelector((state: RootState) => state.user.user);
  const isOwner = currentUser?.id === resume?.posterId?._id;

  console.log('posterId: ', resume?.posterId?._id); 

  const { deleteResume } = useResumeActions(id);
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
      <styles.Row>
        {/* Right Section: Resume Viewer */}
        <styles.Col md={8} className="order-1 order-md-2">
          <ViewerSection
            id={id}
            resume={resume}
            isOwner={isOwner}
            handleDownloadResume={handleDownloadResume}
            deleteResume={deleteResume}
          />
        </styles.Col>
        {/* Left Section: Comments */}
        <styles.Col md={4} className="order-2 order-md-1 border-end">
          <CommentsSection id={id || ''} />
        </styles.Col>
      </styles.Row>
    </styles.Container>
  );
};

export default ResumeDetails;
