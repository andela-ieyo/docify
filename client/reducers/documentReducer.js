import {
  ADD_DOCUMENT,
  LOAD_CATEGORY_DOCUMENTS,
  DELETE_DOCUMENT_SUCCESS,
  UPDATE_DOCUMENT } from '../constants/documents';

export default function documentReducer(state = {}, action) {
  switch (action.type) {
    case ADD_DOCUMENT: {
      const { category, document } = action;
      const { privateDocuments : { rows = [] } = {} }  = state;
      const updatedDocList = rows.concat(document);
      return { ...state, [category]: { count: updatedDocList.length, rows: updatedDocList } };
    }

    case DELETE_DOCUMENT_SUCCESS: {
      const { category, docId } = action;
      const { [category] : { rows = [] } = {} }  = state;
      const newDocumentList = rows.filter((row) => row.id !== docId);
      return { ...state, [category]: { count: newDocumentList.length, rows: newDocumentList } };
    }

    case UPDATE_DOCUMENT: {
      const { documentDetails, docId, category } = action;
      const { [category] : { rows = [] } = {} }  = state;
      const newDocument = rows.find((doc) => doc.id === docId);
      const remainingDocument = rows.filter((doc) => doc.id !== docId);
      const updatedDocument = { ...newDocument, ...documentDetails };
      const updatedDocList = remainingDocument.concat(updatedDocument);
      return { ...state, [category]: { count: updatedDocList.length, rows: updatedDocList } };
    }

    case LOAD_CATEGORY_DOCUMENTS: {
      const { category, documents } = action;
      return { ...state, [category]: documents };
    }

    default:
      return state;
  }
}

