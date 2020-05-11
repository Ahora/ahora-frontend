import { OrganizationsState, OrganizationsActionTypes, SET_CURRENT_USER, SET_SEARCH_CRITERIAS } from './types'

const initialState: OrganizationsState = {
    currentOrganization: undefined,
    SearchCriterias: { status: ["opened"] }
}

export function currentOrganizationsReducer(state = initialState, action: OrganizationsActionTypes): OrganizationsState {
    switch (action.type) {
        case SET_CURRENT_USER:
            return { ...state, currentOrganization: action.data }
        case SET_SEARCH_CRITERIAS:
            return { ...state, SearchCriterias: action.data }
        default:
            return state
    }
}