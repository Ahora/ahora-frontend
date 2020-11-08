import { Doc } from "app/services/docs";
import { SET_DOC } from "./types";

export const setDocInState = (doc: Doc) => ({ type: SET_DOC, payload: doc });
