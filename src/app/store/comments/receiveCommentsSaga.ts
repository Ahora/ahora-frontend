import { call, put, takeLatest } from 'redux-saga/effects'
import { REQUEST_COMMENTS, RequestCommentsAction } from './types';
import { getComments, Comment } from 'app/services/comments';
import { store } from '..';
import { receiveCommentsToState } from './actions';

function* getShortcutsFromServer(action: RequestCommentsAction) {
    const state = store.getState();
    let toDate: Date | undefined;

    const commentState = state.comments.docs.get(action.payload.docId);
    if (commentState?.comments && commentState?.comments.length > 0) {
        const commentId = commentState.comments[0];
        const toComment = commentState.map.get(commentId);

        toDate = toComment?.createdAt;
    }

    const data: Comment[] = yield call(getComments, state.organizations.currentOrganization!.login, action.payload.docId, toDate);
    yield put(receiveCommentsToState(data.reverse(), action.payload.docId));
}

function* mySaga() {
    yield takeLatest(REQUEST_COMMENTS, getShortcutsFromServer);
}

export default mySaga;