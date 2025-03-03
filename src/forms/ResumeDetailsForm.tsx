import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { fetchResumeVersionsAsync, updateResumeDescriptionAsync } from '../redux/resumeSlice';
import useResumeActions from '../middleware/useResumeActions';
import { useAppDispatch, useAppSelector } from '../redux/store';

interface ResumeDetailsFormProps {
  resumeId: string;
  initialDescription: string;
  onSuccess: () => void;
}

const ResumeDetailsForm: React.FC<ResumeDetailsFormProps> = ({
  resumeId,
  initialDescription = '',
  onSuccess,
}) => {
  const { id } = useParams<{ id: string }>();
  const [newDescription, setNewDescription] = useState(initialDescription);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const { updateDescription } = useResumeActions(id);
  const dispatch = useAppDispatch();
  const resumeVersions = useAppSelector((state) => state.resumes.versions) || [];

  useEffect(() => {
    if (resumeId) {
      dispatch(fetchResumeVersionsAsync(resumeId));
    }
  }, [dispatch, resumeId]);

  const handleDescriptionUpdate = async () => {
    if (newDescription.trim() === initialDescription) {
      setIsEditing(false);
      return;
    }

    try {
      const actionResult = await updateDescription(newDescription.trim());

      if (updateResumeDescriptionAsync.fulfilled.match(actionResult)) {
        alert('Resume description updated successfully.');
        onSuccess();
      } else {
        alert('Failed to update description.');
      }
    } catch (error) {
      alert('An unexpected error occurred.');
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <Form className="mt-3">
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          disabled={isEditing}
        />
      </Form.Group>
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
      <Button
        className="mt-2"
        variant="warning"
        onClick={handleDescriptionUpdate}
        disabled={newDescription.trim() === initialDescription || isEditing}
      >
        Update Description
      </Button>
    </Form>
  );
};

export default ResumeDetailsForm;