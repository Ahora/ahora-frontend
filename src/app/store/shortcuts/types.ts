import { SearchCriterias } from "app/components/SearchDocsInput";
import { OrganizationShortcut } from "app/services/OrganizationShortcut";
import { SET_CURRENT_ORGANIZATION } from "../organizations/types";
import StoreOrganizationShortcut from "./StoreOrganizationShortcut";



export interface ShortcutsState {
    shortcuts: OrganizationShortcut[],
    loading: boolean,
    map: Map<string, StoreOrganizationShortcut>
}

// src/store/chat/types.ts
export const ADD_SHORTCUT = 'ADD_SHORTCUT';
export const UPDATE_SHURTCUT_SEARCH_CRITERIAS = 'UPDATE_SHURTCUT_SEARCH_CRITERIAS';
export const DELETE_SHORTCUT = 'DELETE_SHORTCUT';
export const UPDATE_SHORTCUT = 'UPDATE_SHORTCUT';
export const FETCH_SHORTCUTS = 'FETCH_SHORTCUTS';
export const REFRESH_SHORTCUTS = 'REFRESH_SHORTCUTS';
export const RECEIVE_SHORTCUTS = 'RECEIVE_SHORTCUTS';
export const UPDATE_UNREAD_DOCS_SHORTCUT = 'UPDATE_UNREAD_DOCS_SHORTCUT';
export const REPORT_DOC_READ = 'REPORT_DOC_READ';


interface SetOrg {
    type: typeof SET_CURRENT_ORGANIZATION
}

interface AddShortcutAction {
    type: typeof ADD_SHORTCUT
    payload: OrganizationShortcut
}

interface UpdateShortcutDocs {
    type: typeof UPDATE_UNREAD_DOCS_SHORTCUT
    payload: {
        shortcutId: string;
        unreadDocs: number[]
    }
}

interface UpdateShortcutAction {
    type: typeof UPDATE_SHORTCUT
    payload: OrganizationShortcut
}

interface UpdateShortcutSearchCriteriasAction {
    type: typeof UPDATE_SHURTCUT_SEARCH_CRITERIAS
    payload: {
        shortcutId: string,
        searchCriterias: SearchCriterias
    }
}

interface ReportDocReadAction {
    type: typeof REPORT_DOC_READ
    payload: number
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

export type ShortcutActionTypes = AddShortcutAction | DeleteShortcutAction | ReportDocReadAction | FetchShortcutesAction | UpdateShortcutAction | SetOrg | UpdateShortcutDocs | UpdateShortcutSearchCriteriasAction