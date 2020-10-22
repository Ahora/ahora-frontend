import { ShortcutsState, ShortcutActionTypes, ADD_SHORTCUT, DELETE_SHORTCUT, RECEIVE_SHORTCUTS, UPDATE_SHORTCUT } from './types'
import { OrganizationShortcut } from 'app/services/OrganizationShortcut';

const initialState: ShortcutsState = {
    shortcuts: [],
    map: new Map<number, OrganizationShortcut>(),
    loading: false
}

export function shortcutsReducer(state = initialState, action: ShortcutActionTypes): ShortcutsState {
    switch (action.type) {
        case ADD_SHORTCUT:
            state.map.set(action.payload.id!, action.payload);
            return { ...state, shortcuts: [...state.shortcuts, action.payload], map: state.map }
        case RECEIVE_SHORTCUTS:
            const shortcuts: OrganizationShortcut[] = [];
            state.map.clear();
            action.data.forEach((shortcut) => {
                shortcuts.push(shortcut);
                state.map.set(shortcut.id!, shortcut);
            });
            return { ...state, shortcuts, map: state.map, loading: false }
        case DELETE_SHORTCUT:
            state.map.delete(action.meta.id);
            return {
                ...state,
                map: state.map,
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