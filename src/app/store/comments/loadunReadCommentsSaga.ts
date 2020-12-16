import { call, put, takeEvery } from 'redux-saga/effects'
import { REQUEST_UNREAD_COMMENTS, RequestCommentsAction } from './types';
import { getComments, Comment } from 'app/services/comments';
import { store } from '..';
import { receiveUnreadCommentsToState } from './actions';

function* getShortcutsFromServer(action: RequestCommentsAction) {

    const state = store.getState();
    let fromDate: Date | undefined;

    const commentState = state.comments.docs.get(action.payload);
    if (!commentState || !commentState.loading) {
        //first load, we will want to load unread and read comment separatly.
        if (commentState?.comments === undefined) {
            const doc = state.docs.docs.get(action.payload);
            //Load old comments from the last update date
            //Load more unread messages as well from the same date
            fromDate = doc?.lastView ? doc?.lastView.updatedAt : doc?.createdAt;
        }

        if ((commentState?.moreComments === undefined || commentState?.moreComments.length !== commentState.unReadCommentsCount) && fromDate) {
            const unreadComments: Comment[] = yield call(getComments, state.organizations.currentOrganization!.login, action.payload, undefined, fromDate);
            yield put(receiveUnreadCommentsToState(action.payload, unreadComments.reverse()));

        }
    }
}

function* mySaga() {
    yield takeEvery(REQUEST_UNREAD_COMMENTS, getShortcutsFromServer);
}

export default mySaga;