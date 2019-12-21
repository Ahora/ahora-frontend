import { Organization } from 'app/services/organizations';
import { SET_CURRENT_USER } from './types';

export const setCurrentOrganization = (org: Organization) => ({ type: SET_CURRENT_USER, data: org });