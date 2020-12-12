import { call, put, takeEvery } from 'redux-saga/effects'
import { LoadUnReadCommentsAction, LOAD_UNREAD_COMMENTS } from './types';
import { loadUnreadComments } from 'app/services/docs';
import { setCommentsDataInState } from './actions';

function* getUnReadComments(action: LoadUnReadCommentsAction) {
    const data: any = yield call(loadUnreadComments, action.payload);
    yield put(setCommentsDataInState(data));
}

function* mySaga() {
    yield takeEvery(LOAD_UNREAD_COMMENTS, getUnReadComments);
}

export default mySaga;