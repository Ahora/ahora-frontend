import { ADD_LABEL, DELETE_LABEL, LabelActionTypes, FETCH_LABELS, RECEIVE_LABELS } from './types'
import { Label } from 'app/services/labels'

export function addLabel(newLabel: Label): LabelActionTypes {
    return {
        type: ADD_LABEL,
        payload: newLabel
    }
}

export const requestLabelsData = () => ({ type: FETCH_LABELS });
export const receiveLabelsData = (data: Label[]) => ({ type: RECEIVE_LABELS, data });

export function deleteLabel(id: number): LabelActionTypes {
    return {
        type: DELETE_LABEL,
        meta: {
            id
        }
    }
}