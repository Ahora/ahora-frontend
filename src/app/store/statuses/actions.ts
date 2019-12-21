import { ADD_STATUS, RECEIVE_STATUSES, StatusActionTypes, FETCH_STATUSES, DELETE_STATUS, UPDATE_STATUS } from './types'
import { Status } from 'app/services/statuses';

export function addStatusFromState(newStatus: Status): StatusActionTypes {
    return {
        type: ADD_STATUS,
        payload: newStatus
    }
}


export function updateStatusToState(newStatus: Status): StatusActionTypes {
    return {
        type: UPDATE_STATUS,
        payload: newStatus
    }
}

export const requestStatusesData = () => ({ type: FETCH_STATUSES });
export const receiveStatusesData = (data: Status[]) => ({ type: RECEIVE_STATUSES, data });

export function deleteStatusFromState(id: number): StatusActionTypes {
    return {
        type: DELETE_STATUS,
        meta: {
            id
        }
    }
}