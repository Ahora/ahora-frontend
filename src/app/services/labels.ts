
import { RestCollectorClient } from "rest-collector";

export interface Label {
    id?: number;
    name: string;
    description: string;
    color: string;
}



const labelsClient: RestCollectorClient = new RestCollectorClient("/api/organizations/{organizationId}/labels/{:id}");
export const getLabels = async (): Promise<Label[]> => {
    const result = await labelsClient.get({
        params: { organizationId: 1 }
    });
    return result.data;
}

export const addLabel = async (organizationId: number, newLabel: Label): Promise<Label> => {
    const result = await labelsClient.post({
        params: { organizationId },
        data: newLabel
    });
    return result.data;
}