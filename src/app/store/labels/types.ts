import { Label } from "app/services/labels";

export interface LabelsState {
    labels: Label[],
    loading: boolean,
    mapById: Map<number, Label>;
    recentLabels: Set<number>;
}

// src/store/chat/types.ts
export const ADD_LABEL = 'ADD_LABEL';
export const DELETE_LABEL = 'DELETE_LABEL';
export const UPDATE_LABEL = 'UPDATE_LABEL';
export const REQUEST_LABEL = 'REQUEST_LABEL';
export const LABEL_USED = 'LABEL_USED';

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

interface LabelUsedAction {
    type: typeof LABEL_USED
    payload: number
}

export interface RequestLabelAction {
    type: typeof REQUEST_LABEL,
    payload: number
}

export type LabelActionTypes = LabelUsedAction | AddLabelAction | DeleteLabelAction | RequestLabelAction | UpdateLabelAction