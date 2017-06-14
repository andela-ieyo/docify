import toastr from 'toastr';
import { SAVE_DOCUMENT_SUCCESS } from '../constants/documents';


export const saveDocumentSuccess = (documents, category) =>
  ({ type: SAVE_DOCUMENT_SUCCESS, documents, category });


export const retrieveMyDocuments = (userId) =>
(dispatch, getState, { client }) => client.get(`/api/users/${userId}/documents`)
      .then(res => {
        if (res.data.message) {
          toastr.info(res.data.message);
        }
        const documents = res.data;
        dispatch(saveDocumentSuccess(documents, 'myDocuments'));
      }, error => {
        const errorMsgs = error.response.data.message;
        toastr.error(errorMsgs);
      });

export const retrieveAllDocuments = () =>
(dispatch, getState, { client }) => client.get('/api/documents')
      .then(res => {
        if (res.data.count === 0) {
          toastr.info('You have 0 documents.');
        }
        const allDocuments = res.data.rows;
        dispatch(saveDocumentSuccess(allDocuments, 'allDocuments'));
      }, error => {
        const errorMsgs = error.response.data.message;
        toastr.error(errorMsgs);
      }
      );

export const createDocument = (fieldData) =>
(dispatch, getState, { client }) => client.post('/api/documents', fieldData)
      .then(res => {
        const successMsg = res.data.message;
        toastr.success(successMsg);
      }, error => {
        const errorMsgs = error.response.data.message;
        toastr.error(errorMsgs);
      }
      );

export const saveEditedDoc = (docId, fieldData) => (dispatch, getState, { client }) =>
  client.put(`/api/documents/${docId}`, fieldData)
      .then(res => {
        const successMsg = res.data.message;
        dispatch(retrieveAllDocuments());
        toastr.success(successMsg);
      }, error => {
        const errorMsgs = error.response.data.message;
        toastr.error(errorMsgs);
      }
      );

export const searchDocs = (searchData) => (dispatch, getState, { client }) =>
  client.get(`/api/search/documents/?docTitle=${searchData}`)
      .then(res => {
        const searchResult = res.data;
        if (res.data.message) {
          toastr.info(res.data.message);
        }

        dispatch(saveDocumentSuccess(searchResult, 'searchDocuments'));
      }, error => {
        const errorMsgs = error.response.data.message;
        toastr.error(errorMsgs);
      }
      );

