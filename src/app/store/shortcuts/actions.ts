import { ADD_SHORTCUT, RECEIVE_SHORTCUTS, ShortcutActionTypes, FETCH_SHORTCUTS, DELETE_SHORTCUT, UPDATE_SHORTCUT, UPDATE_UNREAD_DOCS_SHORTCUT, UPDATE_SHURTCUT_SEARCH_CRITERIAS } from './types'
import { OrganizationShortcut } from 'app/services/OrganizationShortcut';
import { SearchCriterias } from 'app/components/SearchDocsInput';

export function addShortcutFromState(newShortcut: OrganizationShortcut): ShortcutActionTypes {
    return {
        type: ADD_SHORTCUT,
        payload: newShortcut
    }
}

export function setShortcutUnReadAndDocs(shortcutId: string | number, unreadDocs: number[], docs: number[]): ShortcutActionTypes {
    return {
        type: UPDATE_UNREAD_DOCS_SHORTCUT,
        payload: {
            shortcutId,
            docs,
            unreadDocs
        }
    }

}

export function updateShortcutToState(newShortcut: OrganizationShortcut): ShortcutActionTypes {
    return {
        type: UPDATE_SHORTCUT,
        payload: newShortcut
    }
}


export function updateShortcutsearchCriteria(shortcutId: string, searchCriterias: SearchCriterias): ShortcutActionTypes {
    return {
        type: UPDATE_SHURTCUT_SEARCH_CRITERIAS,
        payload: { shortcutId, searchCriterias }
    }
}

export const requestShortcutsData = () => ({ type: FETCH_SHORTCUTS });
export const receiveShortcutsData = (data: OrganizationShortcut[]) => ({ type: RECEIVE_SHORTCUTS, data });

export function deleteShortcutFromState(id: number): ShortcutActionTypes {
    return {
        type: DELETE_SHORTCUT,
        meta: {
            id
        }
    }
}