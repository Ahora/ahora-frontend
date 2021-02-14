import { call, delay, put, select, takeEvery } from 'redux-saga/effects'
import { REFRESH_SHORTCUTS } from './types';
import StoreOrganizationShortcut from './StoreOrganizationShortcut';
import { SearchCriterias } from 'app/components/SearchDocsInput';
import { Doc, getDocUnreadMessage } from 'app/services/docs';
import { setShortcutUnReadAndDocs } from './actions';
import { setDocsInState } from '../docs/actions';
import { loadUnReadComments } from '../comments/actions';
import { ApplicationState } from '../types';


export const getStateFromStore = (state: ApplicationState) => state;

interface ShortcutDef {
    shortcutId: string;
    searchCriteria: SearchCriterias;
}
function* getShortcutsData(action: any) {

    const array: ShortcutDef[] = []
    const state = yield select(getStateFromStore);
    const shortcutsMap: Map<string, StoreOrganizationShortcut> = state.shortcuts.map;

    shortcutsMap.forEach((value, key) => {
        array.push({ shortcutId: key, searchCriteria: value.draftsearchCriteria || value.searchCriteria });
    });

    for (let index = 0; index < array.length; index++) {
        const shortcut = array[index];
        const shortcutData = shortcutsMap.get(shortcut.shortcutId);
        if (!shortcutData?.disableNotification) {
            const since = shortcutData?.shortcut?.since;
            let docs: Doc[] = yield call(getDocUnreadMessage, shortcut.searchCriteria, since);
            docs = docs.reverse();
            yield put(setDocsInState(docs));
            yield put(setShortcutUnReadAndDocs(shortcut.shortcutId, docs.map((doc: Doc) => doc.id)));
            yield put(loadUnReadComments(shortcut.searchCriteria, since));
        }
    }

    //Run periodic refresh every 30 seconds
    yield delay(3000000)
    yield put({ type: REFRESH_SHORTCUTS });
}

function* mySaga() {
    yield takeEvery(REFRESH_SHORTCUTS, getShortcutsData);
}

export default mySaga;