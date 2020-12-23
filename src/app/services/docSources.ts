import AhoraRestCollector from "../sdk/AhoraRestCollector";

export interface DocSource {
  id?: number;
  organization: string;
  repo: string;
  lastUpdated?: Date;
  syncing?: boolean;
  startSyncTime?: Date;
}

const docSourceClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/docsources/{id}");
const syncNowClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/docsources/{id}/sync");
export const getDocSources = async (): Promise<DocSource[]> => {
  const result = await docSourceClient.get();
  return result.data;
};

export const addDocSource = async (docSource: DocSource): Promise<DocSource> => {
  const result = await docSourceClient.post({
    data: docSource
  });
  return result.data;
};


export const syncNowDocSource = async (id: number): Promise<DocSource> => {
  const result = await syncNowClient.post({ params: { id } });
  return result.data;
};

export const editDocSource = async (docSource: DocSource): Promise<DocSource> => {
  const result = await docSourceClient.put({
    params: { id: docSource.id },
    data: docSource
  });
  return result.data;
};

export const deleteDocSource = async (id: number): Promise<void> => {
  await docSourceClient.delete({
    params: {
      id
    }
  });
};
