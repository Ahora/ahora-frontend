import { call, put, takeEvery } from 'redux-saga/effects'
import { getReaction } from "app/services/reactions"
import { RequestReactionAction, REQUEST_REACTION } from './types';
import { updateReactionToState } from './actions';

const labels = new Set<number>();

function* getLabelsFromServer(action: RequestReactionAction) {
  if (!labels.has(action.payload)) {
    labels.add(action.payload);
    const data = yield call(getReaction, action.payload);
    yield put(updateReactionToState(data));
  }
}

/*
  Alternatively you may use takeLatest.
 
  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
function* mySaga() {
  yield takeEvery(REQUEST_REACTION, getLabelsFromServer);
}

export default mySaga;