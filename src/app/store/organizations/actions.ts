import { Organization } from 'app/services/organizations';
import { SET_CURRENT_USER, SET_SEARCH_CRITERIAS, RECIEVED_UNREAD_NUMBER, FETCH_UNREAD_NUMBER, REDUCE_UNREAD_COUNT } from './types';
import { OrganizationTeamUser } from 'app/services/organizationTeams';
import { SearchCriterias } from 'app/components/SearchDocsInput';

export const setCurrentOrganization = (org: Organization, orgPermission?: OrganizationTeamUser) => ({ type: SET_CURRENT_USER, data: { currentOrganization: org, currentOrgPermission: orgPermission } });
export const setSearchCriteria = (data: SearchCriterias) => ({ type: SET_SEARCH_CRITERIAS, data });
export const receivedUnreadNumber = (data: number) => ({ type: RECIEVED_UNREAD_NUMBER, data });
export const requestUnReadNumber = () => ({ type: FETCH_UNREAD_NUMBER });
export const reduceUnReadCount = (docId: number) => ({ type: REDUCE_UNREAD_COUNT, data: docId });
