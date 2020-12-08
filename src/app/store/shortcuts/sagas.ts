import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_SHORTCUTS } from './types';
import { receiveShortcutsData } from "./actions";
import { getShortcuts, OrganizationShortcut } from 'app/services/OrganizationShortcut';

function* getShortcutsFromServer(action: any) {
    const data: OrganizationShortcut[] = yield call(getShortcuts);
    yield put(receiveShortcutsData(data));
    //yield put({ type: REFRESH_SHORTCUTS });


}

function* mySaga() {
    yield takeLatest(FETCH_SHORTCUTS, getShortcutsFromServer);
}

export default mySaga;