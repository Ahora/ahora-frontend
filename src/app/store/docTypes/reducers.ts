import { DocTypesState, DocTypeActionTypes, ADD_DOCTYPE, DELETE_DOCTYPE, RECEIVE_DOCTYPES, UPDATE_DOCTYPE } from './types'
import { DocType } from 'app/services/docTypes'

const initialState: DocTypesState = {
    docTypes: [],
    map: new Map<number, DocType>(),
    loading: false
}

export function docTypesReducer(state = initialState, action: DocTypeActionTypes): DocTypesState {
    switch (action.type) {
        case ADD_DOCTYPE:
            return { ...state, docTypes: [...state.docTypes, action.payload] }
        case RECEIVE_DOCTYPES:
            const map = new Map<number, DocType>();
            action.data.forEach((docType) => {
                map.set(docType.id!, docType);
            });
            return { ...state, docTypes: action.data, map }
        case DELETE_DOCTYPE:
            return {
                ...state,
                docTypes: state.docTypes.filter(
                    docType => docType.id !== action.meta.id
                )
            }
        case UPDATE_DOCTYPE:
            return {
                ...state,
                docTypes: state.docTypes.map((docType, i) => i === action.payload.id ? action.payload : docType)
            }
        default:
            return state
    }
}