import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchResumesAsync } from '../redux/resumeSlice';
import { selectIsAuthenticated } from '../redux/userSlice';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Card, Spinner, Pagination } from 'react-bootstrap';
import { Worker, Viewer, PageLayout, Rect, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const ResumeList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: resumesData, loading, error } = useSelector((state: RootState) => state.resumes);
  const [currentPage, setCurrentPage] = useState(1);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  const handleSearch = () => {
    dispatch(fetchResumesAsync({
      page: 1,
      limit: 10,
      format: searchQuery,
      createdAt: searchDate
    }));
  };
  
  useEffect(() => {
    dispatch(fetchResumesAsync({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);
  
  const resumes = resumesData?.resumes || []; 
  const totalPages = resumesData?.totalPages || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pageLayout: PageLayout = {
    buildPageStyles: ({ pageIndex }) => ({
      display: pageIndex === 0 ? 'block' : 'none',
      border: pageIndex === 0 ? '2px solid #000' : 'none',
      backgroundColor: pageIndex % 2 === 0 ? '#007acc' : '#fff',
      margin: 0,
      padding: 0,
    }),
    transformSize: ({ pageIndex, size }: { pageIndex: number, size: Rect }) => {
      return pageIndex === 0
        ? size
        : { height: 0, width: 0 };
    },
  };

  if (loading) return <Spinner animation="border" />;

  if (error) return <div>Error fetching resumes: {error}</div>;

  return (
    <div className="resume-list">
      <Link to="/upload" style={{ marginLeft: '12px' }} >
        <Button variant="primary" className="mb-3">Upload New Resume</Button>
      </Link>
      {isAuthenticated && (
        <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
          <Form.Control
            type="text"
            placeholder="Search by format"
            className="me-2"
            aria-label="Search by format"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Form.Control
            type="date"
            placeholder="Search by date"
            className="me-2"
            aria-label="Search by date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <Button variant="outline-light" onClick={handleSearch} style={{ color: '#007acc'}}>
            <FontAwesomeIcon icon={faBars} /> Search
          </Button>
        </Form>
        )}

      {resumes.length === 0 ? (
        <p>No resumes found.</p>
      ) : (
        resumes.map((resume) => (
          <Card key={resume._id.toString()} className="mb-3">
            <Card.Body>
              <Link to={`/resume/${resume._id}`}>
                <Button variant="primary" style={{ marginBottom: '8px' }}>View Details</Button>
              </Link>
              {resume.format === 'pdf' ? (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
                  <Viewer fileUrl={resume.url} defaultScale={SpecialZoomLevel.PageWidth} pageLayout={pageLayout} />
                </Worker>
              ) : (
                <img src={resume.url} alt="Resume Preview" style={{ maxWidth: '100%', backgroundColor: '#007acc' }} />
              )}
            </Card.Body>
          </Card>
        ))
      )}

      <Pagination className="mt-3" style={{ marginLeft: '12px' }}>
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default ResumeList;
