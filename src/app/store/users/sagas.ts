import { getUserById } from 'app/services/users';
import { call, put, takeEvery } from 'redux-saga/effects'
import { receiveUser } from './actions';
import { REQUEST_USER_INFO } from './types';

function* getUsersFromServer(action: any) {
    try {
        const data = yield call(getUserById, action.payload);
        yield put(receiveUser(data));
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
    yield takeEvery(REQUEST_USER_INFO, getUsersFromServer);
}

export default mySaga;