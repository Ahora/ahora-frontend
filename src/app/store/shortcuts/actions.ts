import { ADD_SHORTCUT, RECEIVE_SHORTCUTS, ShortcutActionTypes, FETCH_SHORTCUTS, DELETE_SHORTCUT, UPDATE_SHORTCUT, UPDATE_UNREAD_DOCS_SHORTCUT, UPDATE_SHURTCUT_SEARCH_CRITERIAS, REPORT_DOC_READ, LOAD_SHORTCUT_DOCS, SHORTCUT_DOCS_RECEIVED, ShortcutDocsReceivedAction, SHORTCUT_DOCS_ADD, ShortcutAddDocAction, UPDATE_SHURTCUT_DRAFT_SEARCH_CRITERIAS } from './types'
import { OrganizationShortcut } from 'app/services/OrganizationShortcut';
import { SearchCriterias } from 'app/components/SearchDocsInput';

export function addShortcutFromState(newShortcut: OrganizationShortcut): ShortcutActionTypes {
    return {
        type: ADD_SHORTCUT,
        payload: newShortcut
    }
}

export function setShortcutUnReadAndDocs(shortcutId: string, unreadDocs: number[]): ShortcutActionTypes {
    return {
        type: UPDATE_UNREAD_DOCS_SHORTCUT,
        payload: {
            shortcutId,
            unreadDocs
        }
    }
}

export function loadShortcutDocs(shortcutId: string, page: number) {
    return {
        type: LOAD_SHORTCUT_DOCS,
        payload: {
            shortcutId,
            page
        }
    }
}

export function UpdateShortcutDocs(shortcutId: string, docs?: number[], totalDocs?: number, page?: number): ShortcutDocsReceivedAction {
    return {
        type: SHORTCUT_DOCS_RECEIVED,
        payload: {
            shortcutId,
            docs,
            totalDocs,
            page
        }
    }
}

export function addDocToShortcut(shortcutId: string, docId: number): ShortcutAddDocAction {
    return {
        type: SHORTCUT_DOCS_ADD,
        payload: {
            shortcutId,
            docId,
        }
    }
}



export function reportDocRead(docId: number) {
    return {
        type: REPORT_DOC_READ,
        payload: docId
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

export function updateShortcutDraftsearchCriteria(shortcutId: string, searchCriterias: SearchCriterias): ShortcutActionTypes {
    return {
        type: UPDATE_SHURTCUT_DRAFT_SEARCH_CRITERIAS,
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