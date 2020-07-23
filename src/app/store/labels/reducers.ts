import { LabelsState, LabelActionTypes, ADD_LABEL, DELETE_LABEL, RECEIVE_LABELS, UPDATE_LABEL } from './types'
import { Label } from 'app/services/labels'

const initialState: LabelsState = {
    labels: [],
    mapById: new Map<number, Label>(),
    mapByName: new Map<string, Label>(),
    loading: false
}

export function labelsReducer(state = initialState, action: LabelActionTypes): LabelsState {
    switch (action.type) {
        case ADD_LABEL:
            return { ...state, labels: [...state.labels, action.payload] }
        case RECEIVE_LABELS:
            const mapById = new Map<number, Label>();
            const mapByName = new Map<string, Label>();

            action.data.forEach((label) => {
                mapById.set(label.id!, label);
                mapByName.set(label.name, label);
            });
            return { ...state, labels: action.data, mapById, mapByName }
        case DELETE_LABEL:
            const mapByIdDelete = state.mapById;
            const mapByNameDelete = state.mapByName;

            //Clear maps by id & code
            const typeToDelete: Label | undefined = mapByIdDelete.get(action.meta.id);
            if (typeToDelete) {
                mapByIdDelete.delete(action.meta.id);
                mapByNameDelete.delete(typeToDelete.name);
            }

            return {
                ...state,
                mapById: mapByIdDelete,
                mapByName: mapByNameDelete,
                labels: state.labels.filter(label => label.id !== action.meta.id)
            }
        case UPDATE_LABEL:
            const mapByIdUpdate = state.mapById;
            const mapByNameUpdate = state.mapByName;

            const typeToUpdate: Label | undefined = mapByIdUpdate.get(action.payload.id!);
            if (typeToUpdate) {

                mapByNameUpdate.set(typeToUpdate.name, action.payload);
                mapByIdUpdate.set(action.payload.id!, action.payload);
            }

            return {
                ...state,
                labels: state.labels.map((label, i) => i === action.payload.id ? action.payload : label)
            }
        default:
            return state
    }
}