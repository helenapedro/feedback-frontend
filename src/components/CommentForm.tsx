import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addComment } from '../services/api'; 
import { loadComments } from '../redux/commentSlice'; 
import { Button, Form, Spinner } from 'react-bootstrap';

interface CommentFormProps {
  resumeId: string; 
}

const CommentForm: React.FC<CommentFormProps> = ({ resumeId }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) {
      setError('Please write a comment');
      return;
    }
    setLoading(true);
    try {
      const response = await addComment(resumeId, comment);
      dispatch(loadComments(response.data)); 
      setComment('');
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to add comment');
      setLoading(false);
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
    </Form>
  );
};

export default CommentForm;
