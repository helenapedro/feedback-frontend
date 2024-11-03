import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { loadResumeDetails } from '../redux/resumeSlice';
import { Link, useParams } from 'react-router-dom';
import { Card, Button, Container, CardBody } from 'react-bootstrap';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import ImageViewer from '../components/ImageViewer';
import '@react-pdf-viewer/core/lib/styles/index.css';
import CommentForm from '../forms/CommentForm';
import CommentList from '../forms/CommentList';

const ResumeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const resume = useSelector((state: RootState) => state.resumes.selected);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(loadResumeDetails(id));
    }
  }, [id, dispatch]);

  if (!resume) return <div>No resume found.</div>;

  const isImage = ['jpg', 'jpeg', 'png'].includes(resume.format);

  const viewerContainerStyle = {
    height: pageCount === 1 ? '500px' : '750px',
    border: '1px solid #ccc',
    marginTop: '20px',
  };

  return (
    <Container>
      <Card>
        <Card.Body>
          <Link to={`/resumes`}>
            <Button variant="primary" style={{ marginBottom: '8px' }}>
              View All Resumes
            </Button>
          </Link>
          {isImage ? (
            <ImageViewer url={resume.url} />
          ) : (
            <CardBody style={viewerContainerStyle}>
              <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js`}>
                <Viewer
                  fileUrl={resume.url}
                  defaultScale={SpecialZoomLevel.PageFit}
                  onDocumentLoad={(e) => setPageCount(e.doc.numPages)} 
                />
              </Worker>
            </CardBody>
          )}
          { id && <CommentList resumeId={id} />} 
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ResumeDetails;
