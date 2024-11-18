import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { updateResumeDescriptionAsync } from '../redux/resumeSlice';

interface ResumeDetailsFormProps {
  resumeId: string;
  initialDescription: string;
  onSuccess: () => void;
}

const ResumeDetailsForm: React.FC<ResumeDetailsFormProps> = ({
  resumeId,
  initialDescription,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [newDescription, setNewDescription] = useState(initialDescription);
  const [isEditing, setIsEditing] = useState(false);

  const handleDescriptionUpdate = async () => {
    if (newDescription.trim() === initialDescription) {
      setIsEditing(false);
      return;
    }

    try {
      const actionResult = await dispatch(
        updateResumeDescriptionAsync({ id: resumeId, description: newDescription.trim() })
      );

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
        <Form.Label>Update Description</Form.Label>
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
        Update
      </Button>
    </Form>
  );
};

export default ResumeDetailsForm;
