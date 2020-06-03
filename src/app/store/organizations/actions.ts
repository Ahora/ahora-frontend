import { Organization } from 'app/services/organizations';
import { SET_CURRENT_USER, SET_SEARCH_CRITERIAS } from './types';
import { OrganizationTeamUser } from 'app/services/organizationTeams';
import { SearchCriterias } from 'app/components/SearchDocsInput';

export const setCurrentOrganization = (org: Organization, orgPermission?: OrganizationTeamUser) => ({ type: SET_CURRENT_USER, data: { currentOrganization: org, currentOrgPermission: orgPermission } });
export const setSearchCriteria = (data: SearchCriterias) => ({ type: SET_SEARCH_CRITERIAS, data });