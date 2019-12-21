import { OrganizationsState, OrganizationsActionTypes, SET_CURRENT_USER } from './types'

const initialState: OrganizationsState = {
    currentOrganization: undefined
}

export function currentOrganizationsReducer(state = initialState, action: OrganizationsActionTypes): OrganizationsState {
    switch (action.type) {
        case SET_CURRENT_USER:
            return { ...state, currentOrganization: action.data }
        default:
            return state
    }
}