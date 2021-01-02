import { Doc } from "app/services/docs";
import { ADD_WATCHER_TO_DOC, DELETE_DOC, DELETE_WATCHER_FROM_DOC, REQUEST_DOC, SET_DOC, SET_DOCS } from "./types";

export const setDocInState = (doc: Doc) => ({ type: SET_DOC, payload: doc });
export const setDocsInState = (docs: Doc[]) => ({ type: SET_DOCS, payload: docs });
export const deleteDocInState = (docId: number) => ({ type: DELETE_DOC, payload: docId });
export const requestDocToState = (docId: number) => ({ type: REQUEST_DOC, payload: docId });
export const addWatcheToDocInState = (docId: number, userId: number) => ({ type: ADD_WATCHER_TO_DOC, payload: { docId, userId } });
export const DeleteWatcheFromDocInState = (docId: number, userId: number) => ({ type: DELETE_WATCHER_FROM_DOC, payload: { docId, userId } });
