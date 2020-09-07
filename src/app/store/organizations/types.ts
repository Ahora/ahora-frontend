import { Organization } from "app/services/organizations";
import { SearchCriterias } from "app/components/SearchDocsInput";
import { OrganizationTeamUser } from "app/services/organizationTeams";

export interface OrganizationsState {
    currentOrganization: Organization | undefined,
    currentOrgPermission?: OrganizationTeamUser;
    searchCriterias: SearchCriterias;
    unreatCount?: number[];
}

export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const FETCH_UNREAD_NUMBER = 'FETCH_UNREAD_NUMBER';
export const RECIEVED_UNREAD_NUMBER = 'RECIEVED_UNREAD_NUMBER';
export const SET_SEARCH_CRITERIAS = 'SET_SEARCH_CRITERIAS';
export const REDUCE_UNREAD_COUNT = 'REDUCE_UNREAD_COUNT';


interface SetCurrentOrganizationAction {
    type: typeof SET_CURRENT_USER,
    data: {
        currentOrganization: Organization | undefined,
        currentOrgPermission?: OrganizationTeamUser;
    }
}

interface SetSearchCriteriasAction {
    type: typeof SET_SEARCH_CRITERIAS,
    data: SearchCriterias
}


interface SetUnReadNumberAction {
    type: typeof RECIEVED_UNREAD_NUMBER,
    data: number[]
}

interface ReduceUnReadCountAction {
    type: typeof REDUCE_UNREAD_COUNT
    data: number
}

export type OrganizationsActionTypes = SetCurrentOrganizationAction | SetSearchCriteriasAction | SetUnReadNumberAction | ReduceUnReadCountAction