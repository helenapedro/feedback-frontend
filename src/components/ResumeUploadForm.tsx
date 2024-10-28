import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../redux/store';
import { uploadResumeAsync } from '../redux/resumeSlice';
import { Button, Form, Spinner } from 'react-bootstrap';

const ResumeUploadForm = () => {
  const dispatch = useDispatch<AppDispatch>();
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
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formFile">
        <Form.Label>Upload Resume</Form.Label>
        <Form.Control type="file" accept=".pdf, .docx, .jpg, .jpeg, .png" onChange={handleFileChange} />
      </Form.Group>
      <Form.Group controlId="formFormat">
        <Form.Label>Format</Form.Label>
        <Form.Control as="select" value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="pdf">PDF</option>
          <option value="docx">DOCX</option>
          <option value="jpg">JPG</option>
          <option value="jpeg">JPEG</option>
          <option value="png">PNG</option>
        </Form.Control>
      </Form.Group>
      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Upload'}
      </Button>
      {error && <div className="text-danger">{error}</div>}
    </Form>
  );
};

export default ResumeUploadForm;
