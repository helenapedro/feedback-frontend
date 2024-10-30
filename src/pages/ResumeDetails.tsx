import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { loadResumeDetails } from '../redux/resumeSlice';
import { Link, useParams } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { Worker, Viewer, PageLayout, SpecialZoomLevel } from '@react-pdf-viewer/core';
import ImageViewer from '../components/ImageViewer';
import '@react-pdf-viewer/core/lib/styles/index.css';
import CommentForm from '../forms/CommentForm';

const ResumeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const resume = useSelector((state: RootState) => state.resumes.selected);

  useEffect(() => {
    if (id) {
      dispatch(loadResumeDetails(id));
    }
  }, [id, dispatch]);

  if (!resume) return <div>No resume found.</div>;

  const isImage = ['jpg', 'jpeg', 'png'].includes(resume.format);

  const pageLayout: PageLayout = {
    buildPageStyles: ({ pageIndex }) => ({
      display: pageIndex < 5 ? 'block' : 'none',
      margin: 0,
      padding: 0,
    }),
    transformSize: ({ pageIndex, size }) => (pageIndex < 5 ? size : { height: 0, width: 0 }),
  };

  return (
    <Card>
      <Card.Body>
        <Link to={`/resume/${resume._id}`}>
          <Button variant="primary" style={{ marginBottom: '8px' }}>
            {resume.format.toUpperCase()} Resume Details
          </Button>
        </Link>
        {isImage ? (
          <ImageViewer url={resume.url} />
        ) : (
          <div style={{ height: '750px', border: '1px solid #ccc', marginTop: '20px' }}>
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js`}>
              <Viewer
                fileUrl={resume.url}
                defaultScale={SpecialZoomLevel.PageFit}
                pageLayout={pageLayout}
              />
            </Worker>
          </div>
        )}
        <CommentForm resumeId={resume._id} />
      </Card.Body>
    </Card>
  );
};

export default ResumeDetails;
