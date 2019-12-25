import { DocTypesState, DocTypeActionTypes, ADD_DOCTYPE, DELETE_DOCTYPE, RECEIVE_DOCTYPES, UPDATE_DOCTYPE } from './types'
import { DocType } from 'app/services/docTypes'

const initialState: DocTypesState = {
    docTypes: [],
    mapById: new Map<number, DocType>(),
    mapByCode: new Map<string, DocType>(),
    loading: false
}

export function docTypesReducer(state = initialState, action: DocTypeActionTypes): DocTypesState {
    switch (action.type) {
        case ADD_DOCTYPE:
            return { ...state, docTypes: [...state.docTypes, action.payload] }
        case RECEIVE_DOCTYPES:
            const mapById = new Map<number, DocType>();
            const mapByCode = new Map<string, DocType>();

            action.data.forEach((docType) => {
                mapById.set(docType.id!, docType);
                mapByCode.set(docType.code, docType);
            });
            return { ...state, docTypes: action.data, mapById, mapByCode }
        case DELETE_DOCTYPE:
            const mapByIdDelete = state.mapById;
            const mapByCodeDelete = state.mapByCode;

            //Clear maps by id & code
            const typeToDelete: DocType | undefined = mapByIdDelete.get(action.meta.id);
            if (typeToDelete) {
                mapByIdDelete.delete(action.meta.id);
                mapByCodeDelete.delete(typeToDelete.code);
            }

            return {
                ...state,
                mapById: mapByIdDelete,
                mapByCode: mapByCodeDelete,
                docTypes: state.docTypes.filter(docType => docType.id !== action.meta.id)
            }
        case UPDATE_DOCTYPE:
            const mapByIdUpdate = state.mapById;
            const mapByCodeUpdate = state.mapByCode;

            const typeToUpdate: DocType | undefined = mapByIdUpdate.get(action.payload.id!);
            if (typeToUpdate) {
                //If the code value was changed, delete if from the dictionary.
                if (typeToUpdate.code !== action.payload.code) {
                    mapByCodeUpdate.delete(typeToUpdate.code);
                }
                mapByCodeUpdate.set(action.payload.code, action.payload);
            }
            mapByIdUpdate.set(action.payload.id!, action.payload);

            return {
                ...state,
                docTypes: state.docTypes.map((docType, i) => i === action.payload.id ? action.payload : docType)
            }
        default:
            return state
    }
}