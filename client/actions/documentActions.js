import {
  LOAD_CATEGORY_DOCUMENTS,
  ADD_DOCUMENT,
  DELETE_DOCUMENT_SUCCESS,
  UPDATE_DOCUMENT
} from '../constants/documents';

/**
 * @desc get all document success action creator.
 *
 * @param {object} documents
 * @param {string} category
 * @returns {object} actiontype, and payload
 */
export const loadCategoryDocuments = (documents, category) =>
  ({
    type: LOAD_CATEGORY_DOCUMENTS,
    documents,
    category
  });

/**
 * @desc create document success action creator
 *
 * @param {object} document
 * @returns {object} actionType, and payload
 */
export const addDocument = (document, category) =>
  ({
    type: ADD_DOCUMENT,
    document,
    category
  });

/**
 * @desc delete document success action creator
 *
 * @param {object} document
 * @returns {object} actionType, and payload
 */
export const deleteDocumentSuccess = (docId, category) =>
  ({
    type: DELETE_DOCUMENT_SUCCESS,
    docId,
    category
  });

/**
 * @desc update document success action creator
 *
 * @param {object} document
 * @returns {object} actionType, and payload
 */
export const updateDocument = (docId, documentDetails, category) =>
  ({
    type: UPDATE_DOCUMENT,
    docId,
    documentDetails,
    category
  });

export const getCategoryDocuments = (page, category) =>
  (dispatch, getState, {
    client
  }) =>
  client.get(`/api/documents/${category}/?page=${page}&limit=6`)
  .then(res => {
    const documents = res.data;
    dispatch(loadCategoryDocuments(documents, `${category}Documents`));
    return res;
  });


/**
 * @desc deletes a document.
 *
 * @param {object} userId
 * @param {string} page. Represents pagination index.
 * @returns {object} returns a success message or error .
 */
export const deleteDocument = (docId, category) =>
  (dispatch, getState, {
    client
  }) =>
  client.delete(`/api/documents/${docId}`)
  .then(res => {
    if (res.status === 200) {
      // dispatch(getCategoryDocuments(page, category));
      dispatch(deleteDocumentSuccess(docId, category));
    }
    return res;
  });

/**
 * @desc calls the create document endpoint.
 *
 * @param {object} fieldData. Represents user Inputs from form element.
 * @returns {object} returns a success message or error.
 */
export const createDocument = (newDocument) =>
  (dispatch, getState, {
    client
  }) => client.post('/api/documents', newDocument)
  .then(res => {
    if (res.status === 200) {
      const { document } = res.data;
      dispatch(addDocument(document, 'privateDocuments'));
    }

    return Promise.resolve(res);
  });

/**
 * @desc calls the update a document endpoint.
 * Calls retrieveAllDocuments action on success.
 *
 * @param {object} docId
 * @param {string} fieldData
 * @returns {object} returns a success message or error message.
 */
export const saveEditedDoc = (docId, documentDetails, category) =>
  (dispatch, getState, {
    client
  }) =>
  client.put(`/api/documents/${docId}`, documentDetails)
  .then(res => {
    if (res.status === 200) {
      dispatch(updateDocument(docId, documentDetails, category));
    }
    return Promise.resolve(res);

  });

