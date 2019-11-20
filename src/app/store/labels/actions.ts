import { ADD_LABEL, DELETE_LABEL, LabelActionTypes } from './types'
import { Label } from 'app/services/labels'

// TypeScript infers that this function is returning SendMessageAction
export function sendMessage(newLabel: Label): LabelActionTypes {
    return {
        type: ADD_LABEL,
        payload: newLabel
    }
}

// TypeScript infers that this function is returning DeleteMessageAction
export function deleteLabel(id: number): LabelActionTypes {
    return {
        type: DELETE_LABEL,
        meta: {
            id
        }
    }
}