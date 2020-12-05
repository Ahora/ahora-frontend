import { UserItem } from "app/services/users";
import { ADD_USER, ADD_USERS, UsersActionTypes, USERS_RECIEVED, USER_USED } from "./types";
import { UsersState } from "./types";

const initialState: UsersState = {
    map: new Map<number, UserItem>(),
    recentUsers: new Set()
}

export function usersReducer(state = initialState, action: UsersActionTypes): UsersState {
    switch (action.type) {
        case ADD_USER:
            state.map.set(action.payload.id, action.payload)
            return state;
        case ADD_USERS:
            for (let index = 0; index < action.payload.length; index++) {
                const user = action.payload[index];
                state.map.set(user.id, user)
            }
            return state;
        case USERS_RECIEVED:
            state.map.set(action.payload.id, action.payload);
            return { ...state, map: state.map };
        case USER_USED:
            state.recentUsers.add(action.payload);
            return { ...state, recentUsers: new Set(state.recentUsers) }
        default:
            return state
    }
}