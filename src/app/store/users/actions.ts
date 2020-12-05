import { UserItem } from 'app/services/users';
import { ADD_USER, ADD_USERS, REQUEST_USER_INFO, UsersActionTypes, USERS_RECIEVED, USER_USED } from './types';

export const addUserToState = (user: UserItem): UsersActionTypes => ({ type: ADD_USER, payload: user });
export const addUsersToState = (users: UserItem[]): UsersActionTypes => ({ type: ADD_USERS, payload: users });
export const receiveUser = (user: UserItem) => ({ type: USERS_RECIEVED, payload: user });
export const requestUserInfo = (userId: number): UsersActionTypes => ({ type: REQUEST_USER_INFO, payload: userId })
export const updateUserUsedInState = (id: number): UsersActionTypes => ({ type: USER_USED, payload: id });