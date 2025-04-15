import { useState } from 'react';
import { useAppDispatch } from '../redux/store';
import { updateResumeAsync, updateResumeDescriptionAsync } from '../redux/resumeSlice';

const useResumeUpdate = (resumeId: string, initialDescription: string, onSuccess: (message: string) => void) => {
  const dispatch = useAppDispatch();
  const [newDescription, setNewDescription] = useState(initialDescription);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState<string | null>(null);

  const handleDescriptionUpdate = async () => {
    if (newDescription.trim() === initialDescription) {
      setIsEditing(false);
      return;
    }

    try {
      const actionResult = await dispatch(updateResumeDescriptionAsync({ id: resumeId, description: newDescription.trim() }));

      if (updateResumeDescriptionAsync.fulfilled.match(actionResult)) {
        const successMessage = 'Resume description updated successfully.';
        setUpdateSuccessMessage(successMessage);
        onSuccess(successMessage); // Call onSuccess with the message
      } else {
        alert('Failed to update description.');
        setUpdateSuccessMessage(null);
      }
    } catch (error) {
      alert('An unexpected error occurred.');
      setUpdateSuccessMessage(null);
    } finally {
      setIsEditing(false);
    }
  };

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
        const successMessage = 'Resume updated successfully.';
        setUpdateSuccessMessage(successMessage);
        onSuccess(successMessage); // Call onSuccess with the message
      } else {
        alert('Failed to update resume.');
        setUpdateSuccessMessage(null);
      }
    } catch (error) {
      alert('An unexpected error occurred.');
      setUpdateSuccessMessage(null);
    }
  };

  return {
    newDescription,
    setNewDescription,
    isEditing,
    setIsEditing,
    selectedFile,
    handleDescriptionUpdate,
    handleFileChange,
    handleResumeUpdate,
    updateSuccessMessage, 
  };
};

export default useResumeUpdate;