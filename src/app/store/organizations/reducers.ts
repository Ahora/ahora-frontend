import { OrganizationsState, OrganizationsActionTypes, SET_CURRENT_ORGANIZATION } from './types'

const initialState: OrganizationsState = {
    currentOrganization: undefined
}

export function currentOrganizationsReducer(state = initialState, action: OrganizationsActionTypes): OrganizationsState {
    switch (action.type) {
        case SET_CURRENT_ORGANIZATION:
            return { ...state, currentOrganization: action.data.currentOrganization, currentOrgPermission: action.data.currentOrgPermission }
        default:
            return state
    }
}