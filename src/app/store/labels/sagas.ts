import { call, put, takeLatest } from 'redux-saga/effects'
import { getLabel } from "app/services/labels"
import { RequestLabelAction, REQUEST_LABEL } from './types';
import { addLabelToState } from './actions';

function* getLabelsFromServer(action: RequestLabelAction) {
    try {
        const data = yield call(getLabel, action.payload);
        yield put(addLabelToState(data));
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
    yield takeLatest(REQUEST_LABEL, getLabelsFromServer);
}

export default mySaga;