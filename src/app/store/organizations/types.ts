import { Organization } from "app/services/organizations";
import { SearchCriterias } from "app/components/SearchDocsInput";
import { OrganizationTeamUser } from "app/services/organizationTeams";

export interface OrganizationsState {
    currentOrganization: Organization | undefined,
    currentOrgPermission?: OrganizationTeamUser;
    SearchCriterias: SearchCriterias
}

export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_SEARCH_CRITERIAS = 'SET_SEARCH_CRITERIAS';


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

export type OrganizationsActionTypes = SetCurrentOrganizationAction | SetSearchCriteriasAction