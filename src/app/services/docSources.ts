import { RestCollectorClient } from "rest-collector";
import { store } from "app/store";

export interface DocSource {
  id?: number;
  organization: string;
  repo: string;
  lastUpdated?: Date;
  syncing?: boolean;
  startSyncTime?: Date;
}

const docSourceClient: RestCollectorClient = new RestCollectorClient(
  "/api/organizations/{organizationId}/docsources/{id}"
);
export const getDocSources = async (): Promise<DocSource[]> => {
  const result = await docSourceClient.get({
    params: {
      organizationId: store.getState().organizations.currentOrganization!.login
    }
  });
  return result.data;
};

export const addDocSource = async (docSource: DocSource): Promise<DocSource> => {
  const result = await docSourceClient.post({
    params: {
      organizationId: store.getState().organizations.currentOrganization!.login
    },
    data: docSource
  });
  return result.data;
};


export const syncNowDocSource = async (id: number): Promise<DocSource> => {
  const result = await docSourceClient.post({
    url: `/api/organizations/${store.getState().organizations.currentOrganization!.login}/docsources/${id}/sync`,
  });
  return result.data;
};

export const editDocSource = async (docSource: DocSource): Promise<DocSource> => {
  const result = await docSourceClient.put({
    params: {
      organizationId: store.getState().organizations.currentOrganization!.login, id: docSource.id!
    },
    data: docSource
  });
  return result.data;
};

export const deleteDocSource = async (id: number): Promise<void> => {
  await docSourceClient.delete({
    params: {
      organizationId: store.getState().organizations.currentOrganization!.login, id
    }
  });
};
