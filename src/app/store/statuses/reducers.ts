import { StatusesState, StatusActionTypes, ADD_STATUS, DELETE_STATUS, RECEIVE_STATUSES } from './types'
import { Status } from 'app/services/statuses'

const initialState: StatusesState = {
    statuses: [],
    map: new Map<number, Status>(),
    loading: false
}

export function statusesReducer(state = initialState, action: StatusActionTypes): StatusesState {
    switch (action.type) {
        case ADD_STATUS:
            return { ...state, statuses: [...state.statuses, action.payload] }
        case RECEIVE_STATUSES:
            const map = new Map<number, Status>();
            action.data.forEach((status) => {
                map.set(status.id!, status);
            });
            return { ...state, statuses: action.data, map }
        case DELETE_STATUS:
            return {
                ...state,
                statuses: state.statuses.filter(
                    status => status.id !== action.meta.id
                )
            }
        default:
            return state
    }
}