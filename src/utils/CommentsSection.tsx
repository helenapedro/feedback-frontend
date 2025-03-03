import React from 'react';
import CommentForm from '../forms/CommentForm';
import CommentList from '../forms/CommentList';

interface CommentsSectionProps {
    id: string | undefined;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ id }) => {
     
     return (
          <>
               {id && <CommentForm resumeId={id} />}
               <div className="mt-4">{id && <CommentList resumeId={id} />}</div>
          </>
     );
};

export default CommentsSection;