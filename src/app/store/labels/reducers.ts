import { LabelsState, LabelActionTypes, ADD_LABEL, DELETE_LABEL, UPDATE_LABEL, LABEL_USED } from './types'
import { Label } from 'app/services/labels'

const initialState: LabelsState = {
    labels: [],
    recentLabels: new Set(),
    mapById: new Map<number, Label>(),
    loading: false
}

export function labelsReducer(state = initialState, action: LabelActionTypes): LabelsState {
    switch (action.type) {
        case DELETE_LABEL:
            state.mapById.delete(action.payload);

            return {
                ...state, ...state, mapById: new Map(state.mapById)
            }
        case UPDATE_LABEL:
        case ADD_LABEL:
            state.mapById.set(action.payload.id!, action.payload);
            return { ...state, mapById: new Map(state.mapById) }
        case LABEL_USED:
            state.recentLabels.add(action.payload);
            return { ...state, recentLabels: new Set(state.recentLabels) }

        default:
            return state
    }
}