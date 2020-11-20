import { call, put, takeEvery } from 'redux-saga/effects'
import { LoadShortcutActions, LOAD_SHORTCUT_DOCS } from './types';
import { store } from '..';
import StoreOrganizationShortcut from './StoreOrganizationShortcut';
import { getDocs, SearchDocResult } from 'app/services/docs';
import { UpdateShortcutDocs } from './actions';
import { setDocsInState } from '../docs/actions';

const pageSize: number = 30;

function* loadDocs(action: LoadShortcutActions) {

    const shortcutsMap: Map<string, StoreOrganizationShortcut> = store.getState().shortcuts.map;
    const shortcut: StoreOrganizationShortcut | undefined = shortcutsMap.get(action.payload.shortcutId);
    if (shortcut) {
        yield put(UpdateShortcutDocs(action.payload.shortcutId));
        const searchResults: SearchDocResult = yield call(getDocs, shortcut.searchCriteria, pageSize * (action.payload.page - 1), pageSize);
        yield put(setDocsInState(searchResults.docs));
        yield put(UpdateShortcutDocs(action.payload.shortcutId, searchResults.docs.map((doc) => doc.id), searchResults.totalCount, action.payload.page));
    }
}

function* mySaga() {
    yield takeEvery(LOAD_SHORTCUT_DOCS, loadDocs);
}

export default mySaga;