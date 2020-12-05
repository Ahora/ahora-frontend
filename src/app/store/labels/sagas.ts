import { call, put, takeEvery } from 'redux-saga/effects'
import { getLabel } from "app/services/labels"
import { RequestLabelAction, REQUEST_LABEL } from './types';
import { addLabelToState } from './actions';

function* getLabelsFromServer(action: RequestLabelAction) {
    console.log(action);
    const data = yield call(getLabel, action.payload);
    console.log(addLabelToState(data));
    yield put(addLabelToState(data));

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