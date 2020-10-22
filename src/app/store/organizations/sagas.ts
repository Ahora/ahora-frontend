import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_UNREAD_NUMBER } from './types';
import { receivedUnreadNumber } from "./actions";
import { getDocUnreadMessage } from 'app/services/docs';

const doit = () => {
    return getDocUnreadMessage({ mention: ["me"] });
}

function* getUnreadNumberFromServer(action: any) {
    try {
        const data = yield call(doit);
        yield put(receivedUnreadNumber(data));
    } catch (e) {
        console.log(e);
    }
}

function* mySaga() {
    yield takeLatest(FETCH_UNREAD_NUMBER, getUnreadNumberFromServer);
}

export default mySaga;