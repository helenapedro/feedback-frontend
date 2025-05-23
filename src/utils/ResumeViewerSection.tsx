import React, { useState } from 'react';
import ResumeViewer from './ResumeViewer';
import ResumeDetailsForm from '../forms/ResumeDetailsForm';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';
import * as styles from 'react-bootstrap';
import { IResume } from '../types';

interface ResumeViewerSectionProps {
  id: string | undefined;
  resume: IResume | null;
  isOwner: boolean;
  handleDownloadResume: () => void;
  deleteResume: () => void;
}

const ResumeViewerSection: React.FC<ResumeViewerSectionProps> = ({
  id,
  resume,
  isOwner,
  handleDownloadResume,
  deleteResume,
}) => {
  const [pageCount, setPageCount] = useState<number>(0);

  if (!resume) return <div>No resume found. Please upload a resume to continue.</div>;

  return (
    <styles.Card className="shadow-sm">
      <styles.Card.Header className="d-flex justify-content-between align-items-center">
        <Link to="/resumes">
          <styles.Button variant="secondary" aria-label="Back to Resumes">
            <FontAwesomeIcon icon={icons.faArrowLeft} />
          </styles.Button>
        </Link>
        <styles.Button
          variant="secondary"
          onClick={handleDownloadResume}
          aria-label="Download Resume"
        >
          <FontAwesomeIcon icon={icons.faDownload} />
        </styles.Button>
      </styles.Card.Header>
      <styles.Card.Body>
        <styles.Card.Title>{resume.description}</styles.Card.Title>
        {isOwner ? (
          <ResumeDetailsForm
            resumeId={id || ''}
            initialDescription={resume.description}
            onSuccess={() => console.log('Details updated!')}
            uploadedBy={resume.posterId.username}
            uploadedAt={resume.createdAt.toString()}
          />
        ) : (
          <p>You don't have permission to edit this resume.</p>
        )}

        <ResumeViewer
          url={resume.url}
          format={resume.format}
          onDocumentLoad={(pageCount) => setPageCount(pageCount)}
        />
      </styles.Card.Body>
      {isOwner && (
        <styles.Card.Footer>
          <styles.Button
            variant="danger"
            onClick={deleteResume}
            aria-label="Delete Resume"
          >
            <FontAwesomeIcon icon={icons.faTrash} /> Delete
          </styles.Button>
        </styles.Card.Footer>
      )}
    </styles.Card>
  );
};

export default ResumeViewerSection;
