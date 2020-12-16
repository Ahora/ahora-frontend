import { call, put, takeEvery } from 'redux-saga/effects'
import { getLabel } from "app/services/labels"
import { RequestLabelAction, REQUEST_LABEL } from './types';
import { addLabelToState } from './actions';

const labels = new Set<number>();

function* getLabelsFromServer(action: RequestLabelAction) {
  if (!labels.has(action.payload)) {
    labels.add(action.payload);
    const data = yield call(getLabel, action.payload);
    yield put(addLabelToState(data));

  }
}

/*
  Alternatively you may use takeLatest.
 
  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
function* mySaga() {
  yield takeEvery(REQUEST_LABEL, getLabelsFromServer);
}

export default mySaga;