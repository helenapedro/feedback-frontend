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
     const { data: comments, loading, error } = useSelector((state: RootState) => state.comments);
     console.log('data: ', comments);
     
     useEffect(() => {
          if (resumeId) {
               dispatch(fetchCommentsAsync(resumeId));
               console.log('resumeId: ', resumeId);
          }
     }, [dispatch, resumeId]);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          if (loading) return; 

          try {
               const { _id } = await dispatch(addCommentAsync({ resumeId, content: comment })).unwrap();
               if (!_id) {
                    throw new Error('Comment creation failed.');
               }
               setComment('');
          } catch (error) {
               console.error('Failed to add comment');
          }
     };

     return (
          <style.Container>
               <style.Card>
                    <style.Card.Body>
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
                              <style.Button style={{ marginTop: '8px' }} variant="primary" type="submit" disabled={loading || !comment.trim()}>
                                   {loading ? <style.Spinner animation="border" size="sm" /> : 'Submit'}
                              </style.Button>
                              {error && <style.CardText className="text-danger">{error}</style.CardText>}
                         </style.Form>

                         <style.Card.Footer>
                              <style.Card.Title style={{ marginTop: '1rem' }}>Comments</style.Card.Title>
                                   {comments && comments.length > 0 ? (
                                        <style.ListGroup className="list-unstyled">
                                             {comments.map((comment) => (
                                                  <style.ListGroupItem key={comment._id} className="media my-3">
                                                       <style.CardImg
                                                            src={`https://www.gravatar.com/avatar/${comment.commenterId}?d=identicon`} 
                                                            className="mr-3"
                                                            alt="avatar"
                                                            style={{ width: '50px', borderRadius: '50%' }}
                                                       />
                                                       <style.CardBody className="media-body">
                                                            <h5 className="mt-0 mb-1">{comment.user?.username}</h5>
                                                            <p>{comment.content}</p>
                                                            <small className="text-muted">{new Date(comment.createdAt).toLocaleString()}</small>
                                                       </style.CardBody>
                                                  </style.ListGroupItem>
                                             ))}
                                        </style.ListGroup>
                                   ) : (
                                   <p>No comments available.</p>
                              )}
                         </style.Card.Footer>
                    </style.Card.Body>

               </style.Card>

          </style.Container>
     );
};

export default CommentForm;
