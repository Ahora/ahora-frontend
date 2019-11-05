
import { RestCollectorClient } from "rest-collector";

export interface Organization {
    node_id: number;
    login: string;
    description: string;
}



const docsClient: RestCollectorClient = new RestCollectorClient("/api/organizations/{id}");
export const getOrganizations = async (): Promise<Organization[]> => {
    const result = await docsClient.get();
    return result.data;
}