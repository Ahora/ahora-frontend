import { OrganizationsState, OrganizationsActionTypes, SET_URRENT_ORGANIZATION, SET_SEARCH_CRITERIAS, RECIEVED_UNREAD_NUMBER, REDUCE_UNREAD_COUNT } from './types'

const initialState: OrganizationsState = {
    currentOrganization: undefined,
    searchCriterias: { status: ["open"] }
}

export function currentOrganizationsReducer(state = initialState, action: OrganizationsActionTypes): OrganizationsState {
    switch (action.type) {
        case SET_URRENT_ORGANIZATION:
            return { ...state, currentOrganization: action.data.currentOrganization, currentOrgPermission: action.data.currentOrgPermission }
        case SET_SEARCH_CRITERIAS:
            return { ...state, searchCriterias: action.data }
        case REDUCE_UNREAD_COUNT:
            return { ...state, unreatCount: state.unreatCount && state.unreatCount.filter((docId) => action.data !== docId) }
        case RECIEVED_UNREAD_NUMBER:
            return { ...state, unreatCount: action.data }
        default:
            return state
    }
}