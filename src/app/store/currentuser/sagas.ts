import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_CURRENT_USER } from './types';
import { receiveCurrentUserData } from "./actions";
import { getCurrentUser } from 'app/services/users';

function* getUserFromServer(action: any) {
    try {
        const data = yield call(getCurrentUser);
        yield put(receiveCurrentUserData(data));
    } catch (e) {
        console.log(e);
    }
}

/*
  Alternatively you may use takeLatest.

  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
function* mySaga() {
    yield takeLatest(FETCH_CURRENT_USER, getUserFromServer);
}

export default mySaga;