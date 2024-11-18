import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteResumeAsync, updateResumeDescriptionAsync } from "../redux/resumeSlice";

const useResumeActions = (id: string | undefined) => {
     const dispatch = useDispatch<AppDispatch>();
     const navigate = useNavigate();
 
     const updateDescription = async (description: string) => {
          if (id) {
             return await dispatch(updateResumeDescriptionAsync({ id, description }));
          }
     };
     
     const deleteResume = () => {
          if (id) {
            const userConfirmed = window.confirm(
              'Are you sure you want to delete this resume? This action cannot be undone.'
            );
            
            if (userConfirmed) {
              dispatch(deleteResumeAsync(id)).then(() => {
                navigate('/resumes');
              });
            }
          }
     };
 
     return { updateDescription, deleteResume };
};

export default useResumeActions;