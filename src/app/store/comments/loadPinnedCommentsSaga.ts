import { call, put, takeEvery } from 'redux-saga/effects'
import { REQUEST_PINNED_COMMENTS, RequestCommentsAction } from './types';
import { Comment, getPinnedComments } from 'app/services/comments';
import { receivePinnedCommentsToState } from './actions';
import { ApplicationState } from '../types';

export const getStateFromStore = (state: ApplicationState) => state;


function* getShortcutsFromServer(action: RequestCommentsAction) {
    const data: Comment[] = yield call(getPinnedComments, action.payload);
    yield put(receivePinnedCommentsToState(data, action.payload));
}

function* mySaga() {
    yield takeEvery(REQUEST_PINNED_COMMENTS, getShortcutsFromServer);
}

export default mySaga;