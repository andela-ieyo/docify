import { SAVE_USER_DOCUMENT_SUCCESS } from '../constants/documents';
// import { addFlashMessage } from '../actions/flashMessages';

export const saveUserDocumentSuccess = (documents) => {
  return { type: SAVE_USER_DOCUMENT_SUCCESS, documents };
};

export const retrieveMyDocuments = (userId) => {
  return (dispatch, getState, { client }) => {
    return client.get(`/api/users/${userId}/documents`)
      .then(res => {
        const documents = res.data;
        dispatch(saveUserDocumentSuccess(documents));
      });
  };
};
