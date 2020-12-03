import { Organization } from 'app/services/organizations';
import { SET_CURRENT_ORGANIZATION } from './types';
import { OrganizationTeamUser } from 'app/services/organizationTeams';

export const setCurrentOrganization = (org: Organization, orgPermission?: OrganizationTeamUser) => ({ type: SET_CURRENT_ORGANIZATION, data: { currentOrganization: org, currentOrgPermission: orgPermission } });
