import AhoraRestCollector from "../sdk/AhoraRestCollector";

export interface Status {
  id?: number;
  name: string;
  description: string;
  organizationId?: number;
  hideFromSelection: boolean;
}

const statusesClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/statuses/{id}");
export const getList = async (): Promise<Status[]> => {
  const result = await statusesClient.get();
  return result.data;
};

export const add = async (organizationId: string, status: Status): Promise<Status> => {
  const result = await statusesClient.post({
    params: { organizationId },
    data: status
  });
  return result.data;
};

export const editStatus = async (organizationId: string, status: Status): Promise<Status> => {
  const result = await statusesClient.put({
    params: { organizationId, id: status.id! },
    data: status
  });
  return result.data;
};

export const deleteStatus = async (organizationId: string, id: number): Promise<void> => {
  await statusesClient.delete({
    params: { organizationId, id }
  });
};
