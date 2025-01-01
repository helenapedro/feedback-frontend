import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { updateResumeDescriptionAsync } from '../redux/resumeSlice';
import useResumeActions from '../middleware/useResumeActions';

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
  const { updateDescription } = useResumeActions(id);

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
