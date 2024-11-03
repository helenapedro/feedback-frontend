import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../redux/store';
import { fetchComments, removeComment } from '../redux/commentSlice';
import CommentForm from './CommentForm';

interface CommentListProps {
  resumeId: string;
}

const CommentList: React.FC<CommentListProps> = ({ resumeId }) => {
     const dispatch = useDispatch<AppDispatch>();
     const { comments, loading, error } = useAppSelector((state) => state.comments);

     useEffect(() => {
     dispatch(fetchComments(resumeId));
     }, [dispatch, resumeId]);

     const handleDelete = async (commentId: string) => {
     await dispatch(removeComment(commentId));
     };

     if (loading) return <p>Loading comments...</p>;
     if (error) return <p>{error}</p>;

     return (
     <div>
          <CommentForm resumeId={resumeId} />
          <ul>
          {comments.map((comment) => (
               <li key={comment._id}>
               <p>{comment.content}</p>
               <button onClick={() => handleDelete(comment._id)}>Delete</button>
               {/* CommentForm with commentId for editing */}
               <CommentForm resumeId={resumeId} commentId={comment._id} initialContent={comment.content} />
               </li>
          ))}
          </ul>
     </div>
     );
};

export default CommentList;
