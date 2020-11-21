import { call, put, takeEvery, delay } from 'redux-saga/effects'
import { REFRESH_SHORTCUTS } from './types';
import { store } from '..';
import StoreOrganizationShortcut from './StoreOrganizationShortcut';
import { SearchCriterias } from 'app/components/SearchDocsInput';
import { Doc, getDocUnreadMessage } from 'app/services/docs';
import { setShortcutUnReadAndDocs } from './actions';

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
            const docs: Doc[] = yield call(getDocUnreadMessage, shortcut.searchCriteria, shortcut.shortcutId);
            yield put(setShortcutUnReadAndDocs(shortcut.shortcutId, docs.map((doc: Doc) => doc.id)));
        }
    }

    //Run periodic refresh every 20 minutes
    yield delay(20000)
    yield put({ type: REFRESH_SHORTCUTS });
}

function* mySaga() {
    yield takeEvery(REFRESH_SHORTCUTS, getShortcutsData);
}

export default mySaga;