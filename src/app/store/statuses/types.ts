import { Status } from "app/services/statuses";

export interface StatusesState {
    statuses: Status[],
    loading: boolean,
    map: Map<number, Status>
}

// src/store/chat/types.ts
export const ADD_STATUS = 'ADD_STATUS';
export const DELETE_STATUS = 'DELETE_STATUS';
export const UPDATE_STATUS = 'UPDATE_STATUS';
export const FETCH_STATUSES = 'FETCH_STATUSS';
export const RECEIVE_STATUSES = 'RECEIVE_STATUSS';

interface AddStatusAction {
    type: typeof ADD_STATUS
    payload: Status
}

interface UpdateStatusAction {
    type: typeof UPDATE_STATUS
    payload: Status
}

interface DeleteStatusAction {
    type: typeof DELETE_STATUS
    meta: {
        id: number
    }
}

interface FetchStatusesAction {
    type: typeof RECEIVE_STATUSES,
    data: Status[]
}

export type StatusActionTypes = AddStatusAction | DeleteStatusAction | FetchStatusesAction | UpdateStatusAction