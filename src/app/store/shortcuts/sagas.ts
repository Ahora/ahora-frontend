import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_SHORTCUTS } from './types';
import { receiveShortcutsData } from "./actions";
import { getShortcuts } from 'app/services/OrganizationShortcut';

function* getMilestonesFromServer(action: any) {
    try {
        const data = yield call(getShortcuts);
        yield put(receiveShortcutsData(data));
    } catch (e) {
        console.log(e);
    }
}

/*
  Alternatively you may use takeLatest.

  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
function* mySaga() {
    yield takeLatest(FETCH_SHORTCUTS, getMilestonesFromServer);
}

export default mySaga;