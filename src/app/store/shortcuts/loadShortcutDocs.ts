import { call, put, select, takeEvery } from 'redux-saga/effects'
import { LoadShortcutActions, LOAD_SHORTCUT_DOCS } from './types';
import { ApplicationState } from '../types';
import StoreOrganizationShortcut from './StoreOrganizationShortcut';
import { getDocs, SearchDocResult } from 'app/services/docs';
import { UpdateShortcutDocs } from './actions';
import { setDocsInState } from '../docs/actions';

const pageSize: number = 30;
export const getStateFromStore = (state: ApplicationState) => state;

function* loadDocs(action: LoadShortcutActions) {
    const state = yield select(getStateFromStore);

    const shortcutsMap: Map<string, StoreOrganizationShortcut> = state.shortcuts.map;
    const shortcut: StoreOrganizationShortcut | undefined = shortcutsMap.get(action.payload.shortcutId);
    if (shortcut) {
        //Clean the shortcuts!
        yield put(UpdateShortcutDocs(action.payload.shortcutId));
        const searchResults: SearchDocResult = yield call(getDocs, shortcut.draftsearchCriteria || shortcut.searchCriteria, pageSize * (action.payload.page - 1), pageSize);
        const docs = searchResults.docs.reverse();
        yield put(setDocsInState(docs));
        yield put(UpdateShortcutDocs(action.payload.shortcutId, docs.map((doc) => doc.id), searchResults.totalCount, action.payload.page));
    }
}

function* mySaga() {
    yield takeEvery(LOAD_SHORTCUT_DOCS, loadDocs);
}

export default mySaga;