import { call, put, takeEvery } from 'redux-saga/effects'
import { REQUEST_COMMENTS, RequestCommentsAction } from './types';
import { getComments, Comment } from 'app/services/comments';
import { store } from '..';
import { receiveCommentsToState, receiveUnreadCommentsToState, setLoadingComments } from './actions';

function* getShortcutsFromServer(action: RequestCommentsAction) {

    const state = store.getState();
    let toDate: Date | undefined;
    let fromDate: Date | undefined;

    const commentState = state.comments.docs.get(action.payload.docId);
    if (!commentState || !commentState.loading) {
        //first load, we will want to load unread and read comment separatly.
        if (commentState?.comments === undefined) {
            const doc = state.docs.docs.get(action.payload.docId);
            //Load old comments from the last update date
            //Load more unread messages as well from the same date
            toDate = fromDate = doc?.lastView?.updatedAt;
        }
        else if (commentState?.comments.length > 0) {
            const commentId = commentState.comments[0];
            const toComment = commentState.map.get(commentId);
            toDate = toComment?.createdAt;
        }


        if (toDate) {
            yield put(setLoadingComments(action.payload.docId));
            const data: Comment[] = yield call(getComments, state.organizations.currentOrganization!.login, action.payload.docId, toDate);
            //Using reverse because we are adding more 
            yield put(receiveCommentsToState(data.reverse(), action.payload.docId));
        }

        if (commentState?.moreComments === undefined && fromDate) {
            const unreadComments: Comment[] = yield call(getComments, state.organizations.currentOrganization!.login, action.payload.docId, undefined, fromDate);
            //Using reverse because we are adding more 
            yield put(receiveUnreadCommentsToState(action.payload.docId, unreadComments.reverse()));

        }
    }
}

function* mySaga() {
    yield takeEvery(REQUEST_COMMENTS, getShortcutsFromServer);
}

export default mySaga;