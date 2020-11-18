import { OrganizationsState, OrganizationsActionTypes, SET_CURRENT_ORGANIZATION, RECIEVED_UNREAD_NUMBER, REDUCE_UNREAD_COUNT } from './types'

const initialState: OrganizationsState = {
    currentOrganization: undefined
}

export function currentOrganizationsReducer(state = initialState, action: OrganizationsActionTypes): OrganizationsState {
    switch (action.type) {
        case SET_CURRENT_ORGANIZATION:
            return { ...state, currentOrganization: action.data.currentOrganization, currentOrgPermission: action.data.currentOrgPermission }
        case REDUCE_UNREAD_COUNT:
            return { ...state, unreatCount: state.unreatCount && state.unreatCount.filter((docId) => action.data !== docId) }
        case RECIEVED_UNREAD_NUMBER:
            return { ...state, unreatCount: action.data }
        default:
            return state
    }
}