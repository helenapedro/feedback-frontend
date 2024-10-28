import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCommentAsync, fetchCommentsAsync } from '../redux/commentSlice';
import { Button, Form, Spinner } from 'react-bootstrap';
import { RootState, AppDispatch } from '../redux/store';

interface CommentFormProps {
  resumeId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ resumeId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const loading = useSelector((state: RootState) => state.comments.loading);
  const addError = useSelector((state: RootState) => state.comments.error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      alert('Please write a comment');
      return;
    }

    try {
      await dispatch(addCommentAsync({ resumeId, content: comment })).unwrap();
      dispatch(fetchCommentsAsync(resumeId));
      setComment('');
      setError(''); 
    } catch (err) {
      console.error('Failed to add comment');
      setError('Failed to add comment');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="comment">
        <Form.Label>Add a Comment</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
        />
      </Form.Group>
      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
      </Button>
      {error && <div className="text-danger">{error}</div>}
      {addError && <div className="text-danger">{addError}</div>}
    </Form>
  );
};

export default CommentForm;
