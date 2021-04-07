import { Status } from 'app/services/statuses';
import { RECEIVE_CURRENT_USER, FETCH_CURRENT_USER } from './types';

export const requestCurrentUserData = () => {
    return { type: FETCH_CURRENT_USER };
};
export const receiveCurrentUserData = (data: Status[]) => ({ type: RECEIVE_CURRENT_USER, data });