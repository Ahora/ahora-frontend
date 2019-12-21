import { Organization } from "app/services/organizations";

export interface OrganizationsState {
    currentOrganization: Organization | undefined,
}

export const SET_CURRENT_USER = 'SET_CURRENT_USER';

interface SetCurrentOrganizationAction {
    type: typeof SET_CURRENT_USER,
    data: Organization | undefined
}

export type OrganizationsActionTypes = SetCurrentOrganizationAction