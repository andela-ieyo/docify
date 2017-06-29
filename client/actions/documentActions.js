import toastr from 'toastr';
import { SAVE_DOCUMENT_SUCCESS } from '../constants/documents';


/**
 *
 * @desc save document success action creator.
 * @param {object} documents
 * @param {string} category
 * @returns {object} actiontype, and payload
 */
export const saveDocumentSuccess = (documents, category) =>
  ({ type: SAVE_DOCUMENT_SUCCESS, documents, category });

/**
 *
 * @desc calls the getOne document endpoint.
 *  Retrieves documents for a specific user.
 * @param {object} userId
 * @param {string} page. Represents pagination index.
 * @returns {array} returns an array of all docs owned by a specific user.
 */
export const retrieveMyDocuments = (userId, page) =>
(dispatch, getState, { client }) => client.get(`/api/users/${userId}/documents?page=${page}&limit=6`)
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
/**
 *
 * @desc calls the getAll document paginated endpoint.
 * Retrieves all documents.
 *
 * @param {string} page. Represents Pagination Index
 * @returns {array} returns an array of all docs.
 */
export const retrieveAllDocuments = (page) =>
(dispatch, getState, { client }) => client.get(`api/documents?page=${page}&limit=6`)
      .then(res => {
        if (res.data.count === 0) {
          toastr.info('You have 0 documents.');
        }
        const allDocuments = res.data;
        dispatch(saveDocumentSuccess(allDocuments, 'allDocuments'));
      }, error => {
        const errorMsgs = error.response.data.message;
        toastr.error(errorMsgs);
      }
      );
/**
 *
 * @desc calls the create document endpoint.
 * @param {object} fieldData. Represents user Inputs from form element.
 * @returns {object} returns a success message or error.
 */
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
/**
 *
 * @desc calls the update a dcoument endpoint.
 * Calls retrieveAllDocuments action on success.
 * @param {object} docId
 * @param {string} fieldData
 * @returns {object} returns a success message or error message.
 */
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
/**
 *
 * @desc calls the search endpoint.
 * @param {object} searchQuery
 * @param {string} page. Represents Pagination index.
 * @returns {array} returns an array of all docs matching the search query on success.
 */
export const searchDocs = (searchQuery, page) => (dispatch, getState, { client }) =>
  client.get(`/api/search/documents/?docTitle=${searchQuery}&page=${page}&limit=6`)
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

