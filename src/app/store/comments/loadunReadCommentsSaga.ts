import { call, put, select, takeEvery } from 'redux-saga/effects'
import { REQUEST_UNREAD_COMMENTS, RequestCommentsAction } from './types';
import { getComments, Comment } from 'app/services/comments';
import { receiveUnreadCommentsToState } from './actions';
import { ApplicationState } from '../types';

export const getCommentsFromStore = (state: ApplicationState): ApplicationState => { return state };


function* getShortcutsFromServer(action: RequestCommentsAction) {
    const state: ApplicationState = yield select(getCommentsFromStore);
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
        else if (commentState?.moreComments?.length !== commentState?.unReadCommentsCount) {
            if (commentState?.comments?.length > 0) {
                const commentId = commentState.comments[commentState.comments.length - 1];
                const toComment = commentState.map.get(commentId);
                fromDate = toComment?.createdAt;
            }
        }
        if (fromDate) {
            const unreadComments: Comment[] = yield call(getComments, action.payload, undefined, fromDate);
            yield put(receiveUnreadCommentsToState(action.payload, unreadComments.reverse()));

        }
    }
}

function* mySaga() {
    yield takeEvery(REQUEST_UNREAD_COMMENTS, getShortcutsFromServer);
}

export default mySaga;