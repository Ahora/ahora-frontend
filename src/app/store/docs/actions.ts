import { Doc } from "app/services/docs";
import { SET_DOC, SET_DOCS } from "./types";

export const setDocInState = (doc: Doc) => ({ type: SET_DOC, payload: doc });
export const setDocsInState = (docs: Doc[]) => ({ type: SET_DOCS, payload: docs });
