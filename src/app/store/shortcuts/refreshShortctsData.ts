import { call, delay, put, takeEvery } from 'redux-saga/effects'
import { REFRESH_SHORTCUTS } from './types';
import { store } from '..';
import StoreOrganizationShortcut from './StoreOrganizationShortcut';
import { SearchCriterias } from 'app/components/SearchDocsInput';
import { Doc, getDocUnreadMessage } from 'app/services/docs';
import { setShortcutUnReadAndDocs } from './actions';
import { setDocsInState } from '../docs/actions';
import { loadUnReadComments } from '../comments/actions';

interface ShortcutDef {
    shortcutId: string;
    searchCriteria: SearchCriterias;
}
function* getShortcutsData(action: any) {

    const array: ShortcutDef[] = []
    const shortcutsMap: Map<string, StoreOrganizationShortcut> = store.getState().shortcuts.map;

    shortcutsMap.forEach((value, key) => {
        array.push({ shortcutId: key, searchCriteria: value.searchCriteria });
    });

    for (let index = 0; index < array.length; index++) {
        const shortcut = array[index];

        if (!shortcutsMap.get(shortcut.shortcutId)?.disableNotification) {
            let docs: Doc[] = yield call(getDocUnreadMessage, shortcut.searchCriteria);
            docs = docs.reverse();
            yield put(setDocsInState(docs));
            yield put(setShortcutUnReadAndDocs(shortcut.shortcutId, docs.map((doc: Doc) => doc.id)));
            yield put(loadUnReadComments(shortcut.searchCriteria));
        }
    }

    //Run periodic refresh every 20 minutes
    yield delay(60000)
    yield put({ type: REFRESH_SHORTCUTS });
}

function* mySaga() {
    yield takeEvery(REFRESH_SHORTCUTS, getShortcutsData);
}

export default mySaga;