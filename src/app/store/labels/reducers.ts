import { LabelsState, LabelActionTypes, ADD_LABEL, DELETE_LABEL, RECEIVE_LABELS, UPDATE_LABEL } from './types'
import { Label } from 'app/services/labels'

const initialState: LabelsState = {
    labels: [],
    mapById: new Map<number, Label>(),
    loading: false
}

export function labelsReducer(state = initialState, action: LabelActionTypes): LabelsState {
    switch (action.type) {
        case ADD_LABEL:
            return { ...state, labels: [...state.labels, action.payload] }
        case RECEIVE_LABELS:
            const mapById = new Map<number, Label>();

            action.data.forEach((label) => {
                mapById.set(label.id!, label);
            });
            return { ...state, labels: action.data, mapById }
        case DELETE_LABEL:
            const mapByIdDelete = state.mapById;

            //Clear maps by id & code
            const typeToDelete: Label | undefined = mapByIdDelete.get(action.meta.id);
            if (typeToDelete) {
                mapByIdDelete.delete(action.meta.id);
            }
            return {
                ...state,
                mapById: mapByIdDelete,
                labels: state.labels.filter(label => label.id !== action.meta.id)
            }
        case UPDATE_LABEL:
            const mapByIdUpdate = state.mapById;
            mapByIdUpdate.set(action.payload.id!, action.payload);

            return {
                ...state,
                labels: state.labels.map((label, i) => i === action.payload.id ? action.payload : label)
            }
        default:
            return state
    }
}