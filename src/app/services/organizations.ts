
import { RestCollectorClient } from "rest-collector";
import { OrganizationTeamUser } from "./organizationTeams";

export enum OrganizationType {
    Public = 0,
    Private = 1
}

export interface Organization {
    id: number;
    node_id: number;
    login: string;
    displayName: string;
    description: string;
    orgType: OrganizationType;
    hasPayment: boolean;
}

export interface OrganizationDetailsWithPermission extends Organization {
    permission?: OrganizationTeamUser;
}

const docsClient: RestCollectorClient = new RestCollectorClient("/api/organizations/{login}");
const availableorgClient: RestCollectorClient = new RestCollectorClient("/api/availableorg/{login}");

export const addOrg = async (org: Organization): Promise<Organization> => {
    const result = await docsClient.post({
        data: org
    });
    return result.data;
}

export const getOrganizations = async (): Promise<Organization[]> => {
    const result = await docsClient.get();
    return result.data;
}

export const updateOrganization = async (orgName: string, organization: Organization): Promise<Organization> => {
    const result = await docsClient.put({
        params: { login: orgName },
        data: organization
    });
    return result.data;
}

export const deleteOrganization = async (login: string): Promise<void> => {
    await docsClient.delete({
        params: { login }
    });
}

export const checkOrgAvailability = async (orgLogin: string): Promise<boolean> => {
    const result = await availableorgClient.get({
        params: { login: orgLogin }
    });
    return result.data;
}

export const getOrganizationByLogin = async (login: string): Promise<OrganizationDetailsWithPermission | null> => {
    const result = await docsClient.get({
        params: { login }
    });
    return result.data;
}