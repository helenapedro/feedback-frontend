import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchResumesAsync } from '../redux/resumeSlice';
import { Link } from 'react-router-dom';
import * as style from 'react-bootstrap/';
import { Worker, Viewer, PageLayout, Rect, SpecialZoomLevel } from '@react-pdf-viewer/core';
import Pagination from '../utils/Pagination';
import SearchForm from '../forms/SearchForm';
import '@react-pdf-viewer/core/lib/styles/index.css';

const ResumeList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: resumesData, loading, error } = useSelector((state: RootState) => state.resumes);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (format: string, createdAt: string) => {
    dispatch(fetchResumesAsync({ page: 1, limit: 10, format, createdAt }));
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
      return pageIndex === 0 ? size : { height: 0, width: 0 };
    },
  };

  if (loading) return <style.Spinner animation="border" />;
  if (error) return <div>Error fetching resumes: {error}</div>;

  return (
    <style.Container style={{ maxWidth: '900px', margin: '0 auto', borderRadius: '8px' }}>
      <style.Card>
        <style.CardBody>
          <Link to="/resumes/upload">
            <style.Button variant="primary" className="mb-3">Upload New Resume</style.Button>
          </Link>
          <SearchForm onSearch={handleSearch} />
        </style.CardBody>
      </style.Card>
      <br />
      {resumes.length === 0 ? (
        <p>No resumes found.</p>
      ) : (
        resumes.map((resume) => (
          <style.Card key={resume._id.toString()} className="mb-3" >
            <style.Card.Body>
              <Link to={`/resumes/${resume._id}`}>
                <style.Button variant="primary" style={{ marginBottom: '8px' }}>View Details</style.Button>
              </Link>
              <style.Card.Text>{resume.description}</style.Card.Text>
              {resume.format === 'pdf' ? (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
                  <Viewer fileUrl={resume.url} defaultScale={SpecialZoomLevel.PageWidth} pageLayout={pageLayout} />
                </Worker>
              ) : (
                <img src={resume.url} alt="Resume Preview" style={{ maxWidth: '100%', backgroundColor: '#007acc' }} />
              )}
            </style.Card.Body>
          </style.Card>
        ))
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </style.Container>
  );
};

export default ResumeList;
