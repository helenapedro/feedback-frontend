import React, { useState } from 'react';
import ResumeViewer from './Viewer';
import ResumeDetailsForm from '../../forms/ResumeDetailsForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';
import * as styles from 'react-bootstrap';
import { IResume } from '../../types';

interface ViewerSectionProps {
  id: string | undefined;
  resume: IResume | null;
  isOwner: boolean;
  handleDownloadResume: () => void;
  deleteResume: () => void;
}

const ViewerSection: React.FC<ViewerSectionProps> = ({
  id,
  resume,
  isOwner,
  deleteResume,
}) => {
  const [pageCount, setPageCount] = useState<number>(0);

  if (!resume) return <div>No resume found. Please upload a resume to continue.</div>;

  return (
    <styles.Card className="shadow-sm">
      <styles.Card.Body>
        {isOwner ? (
          <ResumeDetailsForm
            resumeId={id || ''}
            uploadedBy={resume.posterId.username}
            uploadedAt={resume.createdAt.toString()}
            initialDescription={resume.description}
            onSuccess={() => console.log('Details updated!')}
          />
        ) : (
          <p>You don't have permission to edit this resume.</p>
        )}

          {pageCount > 0 && (
               <p className="text-muted">{`This resume has ${pageCount} page(s).`}</p>
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

export default ViewerSection;
