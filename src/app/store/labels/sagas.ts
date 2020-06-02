import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_LABELS } from './types';
import { receiveLabelsData } from "./actions";
import { getList } from "app/services/labels"

function* getLabelsFromServer(action: any) {
    try {
        const data = yield call(getList);
        yield put(receiveLabelsData(data));
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
    yield takeLatest(FETCH_LABELS, getLabelsFromServer);
}

export default mySaga;