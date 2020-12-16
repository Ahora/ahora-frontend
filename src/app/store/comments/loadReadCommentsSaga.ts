import { call, put, takeEvery } from 'redux-saga/effects'
import { REQUEST_READ_COMMENTS, RequestCommentsAction } from './types';
import { getComments, Comment } from 'app/services/comments';
import { store } from '..';
import { receiveCommentsToState } from './actions';

function* getShortcutsFromServer(action: RequestCommentsAction) {

    const state = store.getState();
    let toDate: Date | undefined;

    const commentState = state.comments.docs.get(action.payload);
    if (!commentState || !commentState.loading) {
        //first load, we will want to load unread and read comment separatly.
        if (commentState?.comments === undefined) {
            const doc = state.docs.docs.get(action.payload);
            //Load old comments from the last update date
            //Load more unread messages as well from the same date
            toDate = doc?.lastView ? doc?.lastView.updatedAt : doc?.createdAt;
        }
        else if (commentState?.comments.length > 0) {
            const commentId = commentState.comments[0];
            const toComment = commentState.map.get(commentId);
            toDate = toComment?.createdAt;
        }

        if (toDate) {
            const data: Comment[] = yield call(getComments, state.organizations.currentOrganization!.login, action.payload, toDate);
            yield put(receiveCommentsToState(data.reverse(), action.payload));
        }
    }
}

function* mySaga() {
    yield takeEvery(REQUEST_READ_COMMENTS, getShortcutsFromServer);
}

export default mySaga;