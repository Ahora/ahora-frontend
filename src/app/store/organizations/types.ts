import { Organization } from "app/services/organizations";
import { OrganizationTeamUser } from "app/services/organizationTeams";

export interface OrganizationsState {
    currentOrganization: Organization | undefined,
    currentOrgPermission?: OrganizationTeamUser;
    unreatCount?: number[];
}

export const SET_CURRENT_ORGANIZATION = 'SET_CURRENT_ORGANIZATION';
export const FETCH_UNREAD_NUMBER = 'FETCH_UNREAD_NUMBER';
export const RECIEVED_UNREAD_NUMBER = 'RECIEVED_UNREAD_NUMBER';
export const REDUCE_UNREAD_COUNT = 'REDUCE_UNREAD_COUNT';


interface SetCurrentOrganizationAction {
    type: typeof SET_CURRENT_ORGANIZATION,
    data: {
        currentOrganization: Organization | undefined,
        currentOrgPermission?: OrganizationTeamUser;
    }
}

interface SetUnReadNumberAction {
    type: typeof RECIEVED_UNREAD_NUMBER,
    data: number[]
}

interface ReduceUnReadCountAction {
    type: typeof REDUCE_UNREAD_COUNT
    data: number
}

export type OrganizationsActionTypes = SetCurrentOrganizationAction | SetUnReadNumberAction | ReduceUnReadCountAction