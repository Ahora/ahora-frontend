import { ADD_DOCTYPE, RECEIVE_DOCTYPES, DocTypeActionTypes, FETCH_DOCTYPES, DELETE_DOCTYPE, UPDATE_DOCTYPE, REMEMBER_LAST_DOCTYPE } from './types'
import { DocType } from 'app/services/docTypes';

export function addDocTypeFromState(newDocType: DocType): DocTypeActionTypes {
    return {
        type: ADD_DOCTYPE,
        payload: newDocType
    }
}


export function updateDocTypeToState(newDocType: DocType): DocTypeActionTypes {
    return {
        type: UPDATE_DOCTYPE,
        payload: newDocType
    }
}

export const requestDocTypesData = () => ({ type: FETCH_DOCTYPES });
export const receiveDocTypesData = (data: DocType[]) => ({ type: RECEIVE_DOCTYPES, data });
export const rememberLastDocTypeId = (lastDocTypeId: number) => ({ type: REMEMBER_LAST_DOCTYPE, payload: lastDocTypeId });

export function deleteDocTypeFromState(id: number): DocTypeActionTypes {
    return {
        type: DELETE_DOCTYPE,
        meta: {
            id
        }
    }
}