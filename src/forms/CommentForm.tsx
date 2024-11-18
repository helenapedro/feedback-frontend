import React, { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { addNewComment, fetchComments, updateExistingComment } from '../redux/commentSlice';
import * as style from 'react-bootstrap/';

interface CommentFormProps {
  resumeId: string;
  commentId?: string;
  initialContent?: string;
  onSubmitSuccess?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ resumeId, commentId, initialContent = '', onSubmitSuccess }) => {
     const [content, setContent] = useState(initialContent);
     const dispatch = useDispatch<AppDispatch>();

     const handleSubmit = async (event: FormEvent) => {
          event.preventDefault();
          try {
            if (commentId) {
              await dispatch(updateExistingComment({ commentId, content }));
            } else {
              await dispatch(addNewComment({ resumeId, content }));
              dispatch(fetchComments(resumeId));
            }
            setContent('');
            if (onSubmitSuccess) onSubmitSuccess();
          } catch (error) {
            console.error('Failed to submit comment:', error);
          }
     };
     /* const handleCommentSubmit = async (content: string) => { 
          await dispatch(addNewComment({ resumeId, content })); 
          dispatch(fetchComments(resumeId)); 
     }; */

     return (
          <style.Card.Body>
               <style.Form onSubmit={handleSubmit}>
                    <style.Form.Group controlId="comment">
                         <style.Form.Label style={{ color: '#007bff' }}>Add a Comment</style.Form.Label>
                              <style.Form.Control
                                   as="textarea"
                                   rows={3}
                                   value={content}
                                   onChange={(e) => setContent(e.target.value)}
                                   required
                                   placeholder="Write your comment here..."
                              />
                    </style.Form.Group>
                    <style.Button style={{ marginTop: '8px' }} variant="primary" type="submit">
                         {commentId ? 'Update Comment' : 'Add Comment'}
                    </style.Button>
               </style.Form>
          </style.Card.Body>
     );
};

export default CommentForm;
