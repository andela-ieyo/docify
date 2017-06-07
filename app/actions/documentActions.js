import toastr from 'toastr';
import { SAVE_DOCUMENT_SUCCESS } from '../constants/documents';


export const saveDocumentSuccess = (documents, category) =>
  ({ type: SAVE_DOCUMENT_SUCCESS, documents, category });


export const retrieveMyDocuments = (userId) => {
  return (dispatch, getState, { client }) => {
    return client.get(`/api/users/${userId}/documents`)
      .then(res => {
        const documents = res.data;
        dispatch(saveDocumentSuccess(documents, 'myDocuments'));
      }, error => {
        const errorMsgs = error.response.data.message;
        toastr.error(errorMsgs);
      });
  };
};

export const retrieveAllDocuments = (userId) => {
  return (dispatch, getState, { client }) => {
    return client.get('/api/documents')
      .then(res => {
        const allDocuments = res.data;
        dispatch(saveDocumentSuccess(allDocuments, 'allDocuments'));
      }, error => {
        const errorMsgs = error.response.data.message;
        toastr.error(errorMsgs);
      }
      );
  };
};

export const createDocument = (fieldData) => {
  return (dispatch, getState, { client }) => {
    return client.post('/api/documents', fieldData)
      .then(res => {
        const successMsg = res.data.message;
        toastr.success(successMsg);
      }, error => {
        const errorMsgs = error.response.data.message;
        toastr.error(errorMsgs);
      }
      );
  };
};

export const viewDocument = (fieldData) => {
  return (dispatch, getState, { client }) => {
    return client.post('/api/documents', fieldData)
      .then(res => {
        const successMsg = res.data.message;
        toastr.success(successMsg);
      }, error => {
        const errorMsgs = error.response.data.message;
        toastr.error(errorMsgs);
      }
      );
  };
};



