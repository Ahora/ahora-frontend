import { Doc } from "app/services/docs";
import { DELETE_DOC, REQUEST_DOC, SET_DOC, SET_DOCS } from "./types";

export const setDocInState = (doc: Doc) => ({ type: SET_DOC, payload: doc });
export const setDocsInState = (docs: Doc[]) => ({ type: SET_DOCS, payload: docs });
export const deleteDocInState = (docId: number) => ({ type: DELETE_DOC, payload: docId });
export const requestDocToState = (docId: number) => ({ type: REQUEST_DOC, payload: docId });
