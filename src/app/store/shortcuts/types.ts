import { OrganizationShortcut } from "app/services/OrganizationShortcut";

export interface ShortcutsState {
    shortcuts: OrganizationShortcut[],
    loading: boolean,
    map: Map<number, OrganizationShortcut>
}

// src/store/chat/types.ts
export const ADD_SHORTCUT = 'ADD_SHORTCUT';
export const DELETE_SHORTCUT = 'DELETE_SHORTCUT';
export const UPDATE_SHORTCUT = 'UPDATE_SHORTCUT';
export const FETCH_SHORTCUTS = 'FETCH_SHORTCUTS';
export const RECEIVE_SHORTCUTS = 'RECEIVE_SHORTCUTS';

interface AddShortcutAction {
    type: typeof ADD_SHORTCUT
    payload: OrganizationShortcut
}

interface UpdateShortcutAction {
    type: typeof UPDATE_SHORTCUT
    payload: OrganizationShortcut
}

interface DeleteShortcutAction {
    type: typeof DELETE_SHORTCUT
    meta: {
        id: number
    }
}

interface FetchShortcutesAction {
    type: typeof RECEIVE_SHORTCUTS,
    data: OrganizationShortcut[]
}

export type ShortcutActionTypes = AddShortcutAction | DeleteShortcutAction | FetchShortcutesAction | UpdateShortcutAction