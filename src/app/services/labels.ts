
import AhoraRestCollector from "../sdk/AhoraRestCollector";

export interface RawLabel {
    name: string;
    description?: string;
    color?: string;
}

export interface Label extends RawLabel {
    id: number;

}

const labelesClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/labels/{id}");

export const getList = async (): Promise<Label[]> => {
    const result = await labelesClient.get();
    return result.data;
};

export const getLabel = async (id: number): Promise<Label> => {
    const result = await labelesClient.get({
        params: {
            id,
        }
    });
    return result.data;
};

export const searchLabels = async (q: string): Promise<Label[]> => {
    const result = await labelesClient.get({
        query: { q }
    });
    return result.data;
}

export const addLabel = async (label: RawLabel): Promise<Label> => {
    const result = await labelesClient.post({
        data: label
    });
    return result.data;
};

export const editLabel = async (label: Label): Promise<Label> => {
    const result = await labelesClient.put({
        params: {
            id: label.id!,
        },
        data: label
    });
    return result.data;
};

export const deleteLabel = async (id: number): Promise<void> => {
    await labelesClient.delete({
        params: {
            id,
        }
    });
};
