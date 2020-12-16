import { put, takeEvery } from 'redux-saga/effects'
import { REQUEST_COMMENTS, RequestCommentsAction } from './types';
import { requestReadCommentsToState, requestunReadCommentsToState } from './actions';

function* getShortcutsFromServer(action: RequestCommentsAction) {
    yield put(requestReadCommentsToState(action.payload));
    yield put(requestunReadCommentsToState(action.payload));
}

function* mySaga() {
    yield takeEvery(REQUEST_COMMENTS, getShortcutsFromServer);
}

export default mySaga;