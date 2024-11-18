import React, { useState } from 'react';
import ResumeViewer from './ResumeViewer';
import ResumeDetailsForm from '../forms/ResumeDetailsForm';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';
import * as styles from 'react-bootstrap';

interface ResumeViewerSectionProps {
     id: string | undefined;
     resume: {
         url: string;
         description: string;
         format: string;
     } | null;
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

     if (!resume) return <div>No resume found.</div>;

     return (
          <>
               <styles.Card className="shadow-sm">
                    <styles.Card.Header className="d-flex justify-content-between">
                         <Link to="/resumes">
                              <styles.Button variant="secondary">
                              <FontAwesomeIcon icon={icons.faArrowLeft} />
                              </styles.Button>
                         </Link>
                         <styles.Button variant="secondary" onClick={handleDownloadResume}>
                              <FontAwesomeIcon icon={icons.faDownload} />
                         </styles.Button>
                    </styles.Card.Header>
                    <styles.Card.Body>
                         <styles.Card.Title>{resume.description}</styles.Card.Title>

                         {isOwner && (
                              <ResumeDetailsForm
                              resumeId={id!}
                              initialDescription={resume.description}
                              onSuccess={() => window.location.reload()}
                              />
                         )}
                         <ResumeViewer 
                              url={resume.url} 
                              format={resume.format} 
                              onDocumentLoad={(pageCount) => setPageCount(pageCount)}
                         />
                    </styles.Card.Body>
                    {isOwner && (
                         <styles.Card.Footer>
                              <styles.Button variant="danger" onClick={deleteResume}>
                              <FontAwesomeIcon icon={icons.faTrash} /> Delete
                              </styles.Button>
                         </styles.Card.Footer>
                    )}
                    </styles.Card>
          </>
     );
};

export default ResumeViewerSection;
