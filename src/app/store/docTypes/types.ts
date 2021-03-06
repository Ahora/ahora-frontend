import { DocType } from "app/services/docTypes";

export interface DocTypesState {
    docTypes: DocType[],
    loading: boolean,
    mapById: Map<number, DocType>
    mapByCode: Map<string, DocType>,
    lastDocTypeId?: number
}

// src/store/chat/types.ts
export const ADD_DOCTYPE = 'ADD_DOCTYPE';
export const DELETE_DOCTYPE = 'DELETE_DOCTYPE';
export const REMEMBER_LAST_DOCTYPE = 'REMEMBER_LAST_DOCTYPE';
export const UPDATE_DOCTYPE = 'UPDATE_DOCTYPE';
export const FETCH_DOCTYPES = 'FETCH_DOCTYPES';
export const RECEIVE_DOCTYPES = 'RECEIVE_DOCTYPES';

interface AddDocTypeAction {
    type: typeof ADD_DOCTYPE
    payload: DocType
}

interface UpdateDocTypeAction {
    type: typeof UPDATE_DOCTYPE
    payload: DocType
}

interface RememberLastDocType {
    type: typeof REMEMBER_LAST_DOCTYPE
    payload: number
}

interface DeleteDocTypeAction {
    type: typeof DELETE_DOCTYPE
    meta: {
        id: number
    }
}

interface FetchDocTypeesAction {
    type: typeof RECEIVE_DOCTYPES,
    data: DocType[]
}

export type DocTypeActionTypes = AddDocTypeAction | DeleteDocTypeAction | FetchDocTypeesAction | UpdateDocTypeAction | RememberLastDocType