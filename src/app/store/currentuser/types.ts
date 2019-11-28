import { User } from "app/services/users";

export interface CurrentUserState {
    user: User | undefined,
}

export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';
export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';

interface FetchCurrentUserAction {
    type: typeof RECEIVE_CURRENT_USER,
    data: User | undefined
}

export type UsersActionTypes = FetchCurrentUserAction