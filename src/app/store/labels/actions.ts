import { ADD_LABEL, DELETE_LABEL, LabelActionTypes } from './types'
import { Label } from 'app/services/labels'

export function addLabel(newLabel: Label): LabelActionTypes {
    return {
        type: ADD_LABEL,
        payload: newLabel
    }
}

export function deleteLabel(id: number): LabelActionTypes {
    return {
        type: DELETE_LABEL,
        meta: {
            id
        }
    }
}