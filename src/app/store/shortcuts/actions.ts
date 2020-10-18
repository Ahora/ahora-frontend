import { ADD_SHORTCUT, RECEIVE_SHORTCUTS, ShortcutActionTypes, FETCH_SHORTCUTS, DELETE_SHORTCUT, UPDATE_SHORTCUT } from './types'
import { OrganizationShortcut } from 'app/services/OrganizationShortcut';

export function addShortcutFromState(newShortcut: OrganizationShortcut): ShortcutActionTypes {
    return {
        type: ADD_SHORTCUT,
        payload: newShortcut
    }
}


export function updateShortcutToState(newShortcut: OrganizationShortcut): ShortcutActionTypes {
    return {
        type: UPDATE_SHORTCUT,
        payload: newShortcut
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