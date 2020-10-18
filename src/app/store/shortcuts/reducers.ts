import { ShortcutsState, ShortcutActionTypes, ADD_SHORTCUT, DELETE_SHORTCUT, RECEIVE_SHORTCUTS, UPDATE_SHORTCUT } from './types'
import { OrganizationShortcut } from 'app/services/OrganizationShortcut';

const initialState: ShortcutsState = {
    shortcuts: undefined,
    map: new Map<number, OrganizationShortcut>(),
    loading: false
}

export function shortcutsReducer(state = initialState, action: ShortcutActionTypes): ShortcutsState {
    switch (action.type) {
        case ADD_SHORTCUT:
            return { ...state, shortcuts: [...state.shortcuts, action.payload] }
        case RECEIVE_SHORTCUTS:
            const map = new Map<number, OrganizationShortcut>();
            action.data.forEach((shortcut) => {
                map.set(shortcut.id!, shortcut);
            });
            return { ...state, shortcuts: action.data, map, loading: false }
        case DELETE_SHORTCUT:
            return {
                ...state,
                shortcuts: state.shortcuts ? state.shortcuts.filter(
                    shortcut => shortcut.id !== action.meta.id
                ) : []

            }
        case UPDATE_SHORTCUT:
            return {
                ...state,
                shortcuts: state.shortcuts ? state.shortcuts.map((shortcut) => shortcut.id === action.payload.id ? action.payload : shortcut) : [action.payload]
            }
        default:
            return state
    }
}