import { Organization } from "app/services/organizations";
import { OrganizationTeamUser } from "app/services/organizationTeams";

export interface OrganizationsState {
    currentOrganization: Organization | undefined,
    currentOrgPermission?: OrganizationTeamUser;
}

export const SET_CURRENT_ORGANIZATION = 'SET_CURRENT_ORGANIZATION';


interface SetCurrentOrganizationAction {
    type: typeof SET_CURRENT_ORGANIZATION,
    data: {
        currentOrganization: Organization | undefined,
        currentOrgPermission?: OrganizationTeamUser;
    }
}

export type OrganizationsActionTypes = SetCurrentOrganizationAction