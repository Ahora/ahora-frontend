import { CurrentUserState, UsersActionTypes, RECEIVE_CURRENT_USER } from './types'

const initialState: CurrentUserState = {
    user: undefined
}

export function currentUserReducer(state = initialState, action: UsersActionTypes): CurrentUserState {
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            return { ...state, user: action.data }
        default:
            return state
    }
}