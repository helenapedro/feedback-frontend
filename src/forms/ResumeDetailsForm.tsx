import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form, Row, Col, Card } from 'react-bootstrap';
import { fetchResumeVersionsAsync, updateResumeAsync, updateResumeDescriptionAsync } from '../redux/resumeSlice';
import useResumeActions from '../middleware/useResumeActions';
import { useAppDispatch, useAppSelector } from '../redux/store';

interface ResumeDetailsFormProps {
  resumeId: string;
  initialDescription: string;
  onSuccess: () => void;
  uploadedBy: string;
  uploadedAt: string;
}

const ResumeDetailsForm: React.FC<ResumeDetailsFormProps> = ({
  resumeId,
  initialDescription = '',
  onSuccess,
  uploadedBy,
  uploadedAt,
}) => {
  const { id } = useParams<{ id: string }>();
  const [newDescription, setNewDescription] = useState(initialDescription);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { updateDescription } = useResumeActions(id);
  const dispatch = useAppDispatch();
  const resumeVersions = useAppSelector((state) => state.resumes.versions) || [];

  useEffect(() => {
    if (resumeId) {
      dispatch(fetchResumeVersionsAsync(resumeId));
    }
  }, [dispatch, resumeId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleResumeUpdate = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !['pdf', 'docx', 'jpg', 'jpeg', 'png'].includes(fileExtension)) {
      alert('Invalid file format. Please upload a PDF, DOCX, JPG, JPEG, or PNG file.');
      return;
    }

    try {
      const actionResult = await dispatch(updateResumeAsync({
        id: resumeId,
        file: selectedFile,
        format: fileExtension,
        description: newDescription.trim(),
      }));

      if (updateResumeAsync.fulfilled.match(actionResult)) {
        alert('Resume updated successfully.');
        onSuccess();
      } else {
        alert('Failed to update resume.');
      }
    } catch (error) {
      alert('An unexpected error occurred.');
    }
  };

  return (
    <>
      <Card className="mt-3">
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Version</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedVersion}
                    onChange={(e) => setSelectedVersion(e.target.value)}
                    disabled={isEditing}
                  >
                    <option value="">Select a version</option>
                    {resumeVersions.map((version) => (
                      <option key={version.versionId} value={version.versionId}>
                        {`${version.name}`}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Upload New Resume</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    disabled={isEditing}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={6}>
                <Button
                  variant="primary"
                  onClick={handleResumeUpdate}
                  disabled={!selectedFile || isEditing}
                  className='btn-block'
                >
                  Update Resume
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default ResumeDetailsForm;