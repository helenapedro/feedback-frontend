import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../redux/store';
import { fetchComments, removeComment, updateExistingComment } from '../redux/commentSlice';
import { ListGroup, Button, Spinner, Alert, Container, Row, Col, CardText, CardTitle, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { calculateDaysPassed } from '../utils/Days';

interface CommentListProps {
  resumeId: string;
}

const CommentList: React.FC<CommentListProps> = ({ resumeId }) => {
     const dispatch = useDispatch<AppDispatch>();
     const { comments, loading, error } = useAppSelector((state) => state.comments);
     const user = useAppSelector((state) => state.user.user);
     const [editCommentId, setEditCommentId] = useState<string | null>(null); 
     const [editContent, setEditContent] = useState<string>('');

     useEffect(() => {
     dispatch(fetchComments(resumeId));
     }, [dispatch, resumeId]);

     const handleDelete = async (commentId: string) => {
          await dispatch(removeComment(commentId));
          dispatch(fetchComments(resumeId));
     };

     const handleEdit = (comment: any) => { 
          setEditCommentId(comment._id); 
          setEditContent(comment.content); 
     }; 
     
     const handleUpdate = async () => { 
          if (editCommentId) { 
               await dispatch(updateExistingComment({ commentId: editCommentId, content: editContent })); 
               setEditCommentId(null); 
               setEditContent(''); 
               dispatch(fetchComments(resumeId));
          } 
     };

     if (loading) return <Spinner animation="border" />;
     if (error) return <Alert variant="danger">{error}</Alert>;

     return ( 
          <Card.Body>
               <ListGroup className="mt-3"> {comments.map((comment) => ( 
                         <ListGroup.Item key={comment._id}> 
                              <Row> 
                                   <Col xs={9}> {
                                        editCommentId === comment._id ? ( 
                                             <> 
                                                  <textarea 
                                                       className="form-control" 
                                                       value={editContent} 
                                                       onChange={(e) => 
                                                            setEditContent(e.target.value)} 
                                                  /> 
                                                  <Button variant="success" className="mt-2" onClick={handleUpdate}> 
                                                       <FontAwesomeIcon icon={faSave} /> Save 
                                                  </Button> 
                                                  <Button variant="link" className="mt-2" onClick={() => setEditCommentId(null)}> 
                                                       Cancel 
                                                  </Button> 
                                             </> 
                                        ) : ( 
                                                  <> 
                                                       <CardTitle style={{ color: '#007bff' }}>
                                                            @{comment.commenterId.username}, {calculateDaysPassed(comment.createdAt)}d ❤ by author
                                                       </CardTitle> 
                                                       <CardText>{comment.content}</CardText> 
                                                  </>
                                             )} 
                                   </Col> 
                                   {user?.username === comment.commenterId.username && ( 
                                        <Col xs={3} className="text-end" style={{ overflow: 'hidden' }}> 
                                             {editCommentId !== comment._id && ( 
                                                  <Button variant="link" onClick={() => handleEdit(comment)}> 
                                                       <FontAwesomeIcon icon={faEdit} /> Edit 
                                                  </Button> )} 
                                                  <Button variant="link" onClick={() => handleDelete(comment._id)}> 
                                                       <FontAwesomeIcon icon={faTrash} /> Delete 
                                                  </Button> 
                                        </Col> 
                                   )} 
                              </Row> 
                         </ListGroup.Item> 
                    ))} 
               </ListGroup> 
          </Card.Body>
  );
};

export default CommentList;
