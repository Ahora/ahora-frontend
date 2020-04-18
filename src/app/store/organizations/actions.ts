import { Organization } from 'app/services/organizations';
import { SET_CURRENT_USER, SET_SEARCH_CRITERIAS } from './types';

export const setCurrentOrganization = (org: Organization) => ({ type: SET_CURRENT_USER, data: org });
export const setSearchCriteria = (data: string) => ({ type: SET_SEARCH_CRITERIAS, data });