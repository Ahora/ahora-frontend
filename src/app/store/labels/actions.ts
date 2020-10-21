import { ADD_LABEL, RECEIVE_LABELS, LabelActionTypes, FETCH_LABELS, DELETE_LABEL, UPDATE_LABEL } from './types'
import { Label } from 'app/services/labels';

export function addLabelFromState(newLabel: Label): LabelActionTypes {
    return {
        type: ADD_LABEL,
        payload: newLabel
    }
}

export function updateLabelToState(label: Label): LabelActionTypes {
    return {
        type: UPDATE_LABEL,
        payload: label
    }
}

export const requestLabelsData = () => ({ type: FETCH_LABELS });
export const receiveLabelsData = (data: Label[]) => ({ type: RECEIVE_LABELS, data });

export function deleteLabelFromState(id: number): LabelActionTypes {
    return {
        type: DELETE_LABEL,
        meta: {
            id
        }
    }
}