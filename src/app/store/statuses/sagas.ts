import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_STATUSES } from './types';
import { receiveStatusesData } from "./actions";
import { getList } from "../../services/statuses";

function* getLabelsFromServer(action: any) {
    try {
        const data = yield call(getList);
        yield put(receiveStatusesData(data));
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
    yield takeLatest(FETCH_STATUSES, getLabelsFromServer);
}

export default mySaga;