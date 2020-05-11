import { Organization } from "app/services/organizations";
import { SearchCriterias } from "app/components/SearchDocsInput";

export interface OrganizationsState {
    currentOrganization: Organization | undefined,
    SearchCriterias: SearchCriterias
}

export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_SEARCH_CRITERIAS = 'SET_SEARCH_CRITERIAS';


interface SetCurrentOrganizationAction {
    type: typeof SET_CURRENT_USER,
    data: Organization | undefined
}

interface SetSearchCriteriasAction {
    type: typeof SET_SEARCH_CRITERIAS,
    data: SearchCriterias
}

export type OrganizationsActionTypes = SetCurrentOrganizationAction | SetSearchCriteriasAction