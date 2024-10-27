import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadResume } from '../services/api';
import { addResume } from '../redux/resumeSlice'; 
import { Button, Form, Spinner } from 'react-bootstrap';

const ResumeUploadForm = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState('pdf'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
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
      const response = await uploadResume(file, format);
      dispatch(addResume(response.data)); 
      setFile(null);
      setFormat('pdf'); 
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Upload failed');
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
