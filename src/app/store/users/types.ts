import { UserItem } from "app/services/users";

export interface UsersState {
    map: Map<number, UserItem>;
    recentUsers: Set<number>
}

export const ADD_USER = 'ADD_USER';
export const ADD_USERS = 'ADD_USERS';
export const USER_USED = 'USER_USED';
export const REQUEST_USER_INFO = 'REQUEST_USER_INFO';
export const USERS_RECIEVED = 'USERS_RECIEVED';

interface AddUserAction {
    type: typeof ADD_USER
    payload: UserItem
}
interface AddUsersAction {
    type: typeof ADD_USERS
    payload: UserItem[]
}

interface RequestUserInfoAction {
    type: typeof REQUEST_USER_INFO
    payload: number
}


interface RequestUserInfoAction {
    type: typeof REQUEST_USER_INFO
    payload: number
}
interface UserUsedAction {
    type: typeof USER_USED
    payload: number
}

interface UserReceivedAction {
    type: typeof USERS_RECIEVED
    payload: UserItem
}


export type UsersActionTypes = UserUsedAction | AddUserAction | RequestUserInfoAction | UserReceivedAction | AddUsersAction;