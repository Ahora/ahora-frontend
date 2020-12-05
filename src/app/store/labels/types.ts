import { Label } from "app/services/labels";

export interface LabelsState {
    labels: Label[],
    loading: boolean,
    mapById: Map<number, Label>,
    mapByName: Map<string, Label>
}

// src/store/chat/types.ts
export const ADD_LABEL = 'ADD_LABEL';
export const DELETE_LABEL = 'DELETE_LABEL';
export const UPDATE_LABEL = 'UPDATE_LABEL';
export const REQUEST_LABEL = 'REQUEST_LABEL';

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
    payload: number
}

export interface RequestLabelAction {
    type: typeof REQUEST_LABEL,
    payload: number
}

export type LabelActionTypes = AddLabelAction | DeleteLabelAction | RequestLabelAction | UpdateLabelAction