import { useState } from 'react';
import { useAppDispatch } from '../redux/store';
import { updateResumeAsync, updateResumeDescriptionAsync } from '../redux/resumeSlice';

const useResumeUpdate = (resumeId: string, initialDescription: string, onSuccess: () => void) => {
  const dispatch = useAppDispatch();
  const [newDescription, setNewDescription] = useState(initialDescription);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDescriptionUpdate = async () => {
    if (newDescription.trim() === initialDescription) {
      setIsEditing(false);
      return;
    }

    try {
      const actionResult = await dispatch(updateResumeDescriptionAsync({ id: resumeId, description: newDescription.trim() }));

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

  return {
    newDescription,
    setNewDescription,
    isEditing,
    setIsEditing,
    selectedFile,
    handleDescriptionUpdate,
    handleFileChange,
    handleResumeUpdate,
  };
};

export default useResumeUpdate;