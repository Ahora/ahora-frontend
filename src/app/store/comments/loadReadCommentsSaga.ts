import { call, put, select, takeEvery } from 'redux-saga/effects'
import { REQUEST_READ_COMMENTS, RequestCommentsAction } from './types';
import { getComments, Comment } from 'app/services/comments';
import { receiveCommentsToState } from './actions';
import { ApplicationState } from '../types';

export const getStateFromStore = (state: ApplicationState) => state;


function* getShortcutsFromServer(action: RequestCommentsAction) {
    const state = yield select(getStateFromStore);
    let toDate: Date | undefined;

    const commentState = state.comments.docs.get(action.payload);
    if (!commentState || !commentState.loading) {
        if (commentState?.comments.length > 0) {
            const commentId = commentState.comments[0];
            const toComment = commentState.map.get(commentId);
            toDate = toComment?.createdAt;
        }

        const data: Comment[] = yield call(getComments, action.payload, toDate);
        yield put(receiveCommentsToState(data.reverse(), action.payload));
    }
}

function* mySaga() {
    yield takeEvery(REQUEST_READ_COMMENTS, getShortcutsFromServer);
}

export default mySaga;