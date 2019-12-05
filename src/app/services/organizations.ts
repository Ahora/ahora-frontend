
import { RestCollectorClient } from "rest-collector";

export interface Organization {
    id: number;
    node_id: number;
    login: string;
    description: string;
}
const docsClient: RestCollectorClient = new RestCollectorClient("/api/organizations/{id}");

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