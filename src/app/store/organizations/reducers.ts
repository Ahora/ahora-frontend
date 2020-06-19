import { OrganizationsState, OrganizationsActionTypes, SET_CURRENT_USER, SET_SEARCH_CRITERIAS } from './types'

const initialState: OrganizationsState = {
    currentOrganization: undefined,
    searchCriterias: { status: ["open"] }
}

export function currentOrganizationsReducer(state = initialState, action: OrganizationsActionTypes): OrganizationsState {
    switch (action.type) {
        case SET_CURRENT_USER:
            return { ...state, currentOrganization: action.data.currentOrganization, currentOrgPermission: action.data.currentOrgPermission }
        case SET_SEARCH_CRITERIAS:
            return { ...state, searchCriterias: action.data }
        default:
            return state
    }
}