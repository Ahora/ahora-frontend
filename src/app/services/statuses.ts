
import { RestCollectorClient } from "rest-collector";

export interface Status {
    id?: number;
    name: string;
    description: string;
    color: string;
}

const statusesClient: RestCollectorClient = new RestCollectorClient("/api/organizations/{organizationId}/statuses/{:id}");
export const getList = async (): Promise<Status[]> => {
    const result = await statusesClient.get({
        params: { organizationId: 1 }
    });
    return result.data;
}

export const add = async (organizationId: number, status: Status): Promise<Status> => {
    const result = await statusesClient.post({
        params: { organizationId },
        data: status
    });
    return result.data;
}