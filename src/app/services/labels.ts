
import { RestCollectorClient } from "rest-collector";
import { store } from "app/store";

export interface Label {
    id?: number;
    name: string;
    description?: string;
    color?: string;
}

const labelesClient: RestCollectorClient = new RestCollectorClient("/api/organizations/{organizationId}/labels/{id}");

export const getList = async (): Promise<Label[]> => {
    const result = await labelesClient.get({
        params: {
            organizationId: store.getState().organizations.currentOrganization!.login
        }
    });
    return result.data;
};

export const searchLabels = async (q: string): Promise<Label[]> => {
    const result = await labelesClient.get({
        params: {
            organizationId: store.getState().organizations.currentOrganization!.login
        },
        query: { q }
    });
    return result.data;
}

export const addLabel = async (label: Label): Promise<Label> => {
    const result = await labelesClient.post({
        data: label,
        params: {
            organizationId: store.getState().organizations.currentOrganization!.login
        }
    });
    return result.data;
};

export const editLabel = async (label: Label): Promise<Label> => {
    const result = await labelesClient.put({
        params: {
            id: label.id!,
            organizationId: store.getState().organizations.currentOrganization!.login
        },
        data: label
    });
    return result.data;
};

export const deleteLabel = async (id: number): Promise<void> => {
    await labelesClient.delete({
        params: {
            id,
            organizationId: store.getState().organizations.currentOrganization!.login
        }
    });
};
