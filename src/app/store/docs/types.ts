import { Doc } from "app/services/docs";

export const SET_DOC = 'LOAD_DOC';
export const DELETE_DOC = 'DELETE_DOC';
export const LOAD_DOCS = 'LOAD_DOCS';

export interface DocsState {
    docs: Map<number, DocState>;
}

export interface DocState {
    unReadComments?: number;
    doc: Doc;
}

export interface DocShortcuts {
    docs: number[];
}

interface LoadDocsAction {
    type: typeof LOAD_DOCS
    payload: string | number
}

interface SetDocAction {
    type: typeof SET_DOC
    payload: Doc
}

interface DELETE_DOC_ACTION {
    type: typeof DELETE_DOC
    payload: number
}

export type DocsActionTypes = LoadDocsAction | SetDocAction | DELETE_DOC_ACTION;