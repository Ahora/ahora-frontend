import { Label } from "app/services/labels";

export interface LabelsState {
    labels: Label[],
    loading: boolean,
    mapById: Map<number, Label>
}

// src/store/chat/types.ts
export const ADD_LABEL = 'ADD_LABEL';
export const DELETE_LABEL = 'DELETE_LABEL';
export const UPDATE_LABEL = 'UPDATE_LABEL';
export const FETCH_LABELS = 'FETCH_LABELS';
export const RECEIVE_LABELS = 'RECEIVE_LABELS';

interface AddLabelAction {
    type: typeof ADD_LABEL
    payload: Label
}

interface UpdateLabelAction {
    type: typeof UPDATE_LABEL
    payload: Label
}

interface DeleteLabelAction {
    type: typeof DELETE_LABEL
    meta: {
        id: number
    }
}

interface FetchLabelesAction {
    type: typeof RECEIVE_LABELS,
    data: Label[]
}

export type LabelActionTypes = AddLabelAction | DeleteLabelAction | FetchLabelesAction | UpdateLabelAction