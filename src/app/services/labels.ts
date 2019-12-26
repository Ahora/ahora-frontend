
import AhoraRestCollector from "./base";

export interface Label {
    id?: number;
    name: string;
    description?: string;
    color?: string;
}

const labelesClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/labels/{id}");

export const getList = async (): Promise<Label[]> => {
    const result = await labelesClient.get();
    return result.data;
};

export const addLabel = async (label: Label): Promise<Label> => {
    const result = await labelesClient.post({ data: label });
    return result.data;
};

export const editLabel = async (label: Label): Promise<Label> => {
    const result = await labelesClient.put({
        params: { id: label.id! },
        data: label
    });
    return result.data;
};

export const deleteLabel = async (id: number): Promise<void> => {
    await labelesClient.delete({
        params: { id }
    });
};
