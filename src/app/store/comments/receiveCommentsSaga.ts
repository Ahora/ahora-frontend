import { call, put, takeLatest } from 'redux-saga/effects'
import { REQUEST_COMMENTS, RequestCommentsAction } from './types';
import { getComments, Comment } from 'app/services/comments';
import { store } from '..';
import { receiveCommentsToState } from './actions';

function* getShortcutsFromServer(action: RequestCommentsAction) {
    const state = store.getState();
    const data: Comment[] = yield call(getComments, state.organizations.currentOrganization!.login, action.payload.docId);
    yield put(receiveCommentsToState(data, action.payload.docId));
}

function* mySaga() {
    yield takeLatest(REQUEST_COMMENTS, getShortcutsFromServer);
}

export default mySaga;