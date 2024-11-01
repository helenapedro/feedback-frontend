export const setLoadingState = (state: { loading: boolean; error: null; }) => {
     state.loading = true;
     state.error = null;
};
   
export const setErrorState = (
     state: { updateCommentStatus: string; error: any; }, 
     action: { payload: any; }) => {
     state.updateCommentStatus = 'rejected';
     state.error = action.payload;
};

export const setSucceCommentsState = (
     state: { loading: boolean; data: any; }, 
     action:  { payload: any; }) => {
     state.loading = false;
     state.data = action.payload;
};

   