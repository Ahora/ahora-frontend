import { Doc } from "app/services/docs";

export const SET_DOC = 'SET_DOC';
export const SET_DOCS = 'SET_DOCS';
export const DELETE_DOC = 'DELETE_DOC';
export const LOAD_DOCS = 'LOAD_DOCS';

export interface DocsState {
    docs: Map<number, Doc>;
}

export interface DocShortcuts {
    docs: number[];
}

interface SetDocAction {
    type: typeof SET_DOC
    payload: Doc
}

interface SetDocsAction {
    type: typeof SET_DOCS
    payload: Doc[]
}


export interface DeleteDocAction {
    type: typeof DELETE_DOC
    payload: number
}

export type DocsActionTypes = SetDocAction | DeleteDocAction | SetDocsAction;