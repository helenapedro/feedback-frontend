import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../redux/store';
import { uploadResumeAsync } from '../redux/resumeSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icon from '@fortawesome/free-solid-svg-icons';
import * as style from 'react-bootstrap/';

const ResumeUploadForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState('pdf'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const MAX_FILE_SIZE = 5 * 1024 * 1024; 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError('File size exceeds the 5 MB limit');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }
    setLoading(true);
    try {
      await dispatch(uploadResumeAsync({ file, format })).unwrap();
      navigate('/resumes');
      setFile(null);
      setFormat('pdf'); 
    } catch (err) {
      console.error(err);
      setError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <style.Container style={{ maxWidth: '700px', margin: '0 auto', borderRadius: '8px' }}>
      <style.Card >
        <style.CardBody>
          <style.Form onSubmit={handleSubmit}>
            <style.Form.Group controlId="formFile">
              <style.Form.Label as="h3" style={{ backgroundColor: '#007bff', color: '#fff', borderRadius: '8px 8px 0 0' }}>
                <FontAwesomeIcon icon={icon.faFilePdf} style={{ marginLeft: '8px' }} /> Upload Resume
              </style.Form.Label>
              <style.Form.Control type="file" accept=".pdf, .docx, .jpg, .jpeg, .png" onChange={handleFileChange} />
            </style.Form.Group>
            <style.Form.Group controlId="formFormat">
              <style.Form.Label>Format</style.Form.Label>
              <style.Form.Control as="select" value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="pdf">PDF</option>
                <option value="jpg">JPG</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
              </style.Form.Control>
            </style.Form.Group>
            <style.Button variant="primary" type="submit"  style={{ marginTop: '8px' }} disabled={loading}>
              {loading ? <style.Spinner animation="border" size="sm" /> : 'Upload'}
            </style.Button>
            {error && <div className="text-danger">{error}</div>}
          </style.Form>
        </style.CardBody>
      </style.Card>

    </style.Container>
  );
};

export default ResumeUploadForm;
