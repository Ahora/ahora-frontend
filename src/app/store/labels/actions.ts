import { ADD_LABEL, LabelActionTypes, DELETE_LABEL, UPDATE_LABEL, REQUEST_LABEL } from './types'
import { Label } from 'app/services/labels';

export const addLabelToState = (newLabel: Label): LabelActionTypes => ({ type: ADD_LABEL, payload: newLabel });
export const updateLabelToState = (newLabel: Label): LabelActionTypes => ({ type: UPDATE_LABEL, payload: newLabel });
export const deleteLabelFromState = (id: number): LabelActionTypes => ({ type: DELETE_LABEL, payload: id });
export const requestLabelData = (id: number): LabelActionTypes => ({ type: REQUEST_LABEL, payload: id });