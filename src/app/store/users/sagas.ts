import { getUserById } from 'app/services/users';
import { call, put, takeEvery } from 'redux-saga/effects'
import { receiveUser } from './actions';
import { REQUEST_USER_INFO } from './types';


const users = new Set<number>();

function* getUsersFromServer(action: any) {
    if (!users.has(action.payload)) {
        users.add(action.payload);
        const data = yield call(getUserById, action.payload);
        yield put(receiveUser(data));
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