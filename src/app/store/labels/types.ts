import { Label } from "app/services/labels";

export interface LabelsState {
    labels: Label[]
}

// src/store/chat/types.ts
export const ADD_LABEL = 'ADD_LABEL'
export const DELETE_LABEL = 'DELETE_LABEL'

interface AddLabelAction {
    type: typeof ADD_LABEL
    payload: Label
}

interface DeleteLabelAction {
    type: typeof DELETE_LABEL
    meta: {
        id: number
    }
}

export type LabelActionTypes = AddLabelAction | DeleteLabelAction