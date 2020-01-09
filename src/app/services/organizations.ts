
import { RestCollectorClient } from "rest-collector";

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
    orgType: OrganizationType
}
const docsClient: RestCollectorClient = new RestCollectorClient("/api/organizations/{login}");

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

export const deleteOrganization = async (organization: Organization): Promise<void> => {
    await docsClient.delete({
        params: { login: organization.login }
    });
}

export const getOrganizationByLogin = async (login: string): Promise<Organization | null> => {
    const result = await docsClient.get({
        params: { login }
    });
    return result.data;
}