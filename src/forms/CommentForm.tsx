import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { addCommentAsync, fetchCommentsAsync } from '../redux/commentSlice';
import * as style from 'react-bootstrap/';

interface CommentFormProps {
  resumeId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ resumeId }) => {
     const dispatch = useDispatch<AppDispatch>();
     const [comment, setComment] = useState('');
     const [error, setError] = useState('');

     const comments = useSelector((state: RootState) => state.comments.data);
     const loading = useSelector((state: RootState) => state.comments.loading);
     const addError = useSelector((state: RootState) => state.comments.error);

     useEffect(() => {
     dispatch(fetchCommentsAsync(resumeId));
     }, [dispatch, resumeId]);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          if (!comment.trim()) {
               alert('Please write a comment');
               return;
          }

          try {
               await dispatch(addCommentAsync({ resumeId, content: comment })).unwrap();
               setComment('');
               setError('');
               dispatch(fetchCommentsAsync(resumeId)); 
          } catch (err) {
               console.error('Failed to add comment');
               setError('Failed to add comment');
          }
     };

     return (
          <style.Container>
               <style.Form onSubmit={handleSubmit}>
                    <style.Form.Group controlId="comment">
                         <style.Form.Label>Add a Comment</style.Form.Label>
                              <style.Form.Control
                                   as="textarea"
                                   rows={3}
                                   value={comment}
                                   onChange={(e) => setComment(e.target.value)}
                                   placeholder="Write your comment here..."
                              />
                         </style.Form.Group>
                    <style.Button variant="primary" type="submit" disabled={loading}>
                         {loading ? <style.Spinner animation="border" size="sm" /> : 'Submit'}
                    </style.Button>
                    {error && <div className="text-danger">{error}</div>}
                    {addError && <div className="text-danger">{addError}</div>}
               </style.Form>

               <style.Card.Footer>
                    <style.Card.Title style={{ marginTop: '1rem' }}>Comments</style.Card.Title>
                         {comments && comments.length > 0 ? (
                              <ul className="list-unstyled">
                                   {comments.map((comment) => (
                                        <li key={comment._id} className="media my-3">
                                             <img
                                                  src={`https://www.gravatar.com/avatar/${comment.commenterId}?d=identicon`} 
                                                  className="mr-3"
                                                  alt="avatar"
                                                  style={{ width: '50px', borderRadius: '50%' }}
                                             />
                                             <div className="media-body">
                                                  <h5 className="mt-0 mb-1">{comment.user?.username}</h5>
                                                  <h5 className="mt-0 mb-1">{comment.user?.username}</h5>
                                                  <p>{comment.content}</p>
                                                  <small className="text-muted">{new Date(comment.createdAt).toLocaleString()}</small>
                                             </div>
                                        </li>
                                   ))}
                              </ul>
                         ) : (
                              <p>No comments available.</p>
                         )}
                    </style.Card.Footer>
          </style.Container>
     );
};

export default CommentForm;