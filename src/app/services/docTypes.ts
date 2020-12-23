import AhoraRestCollector from "../sdk/AhoraRestCollector";

export interface DocType {
  id?: number;
  name: string;
  code: string;
  description: string;
  organizationId: Number | null;
}

const docTypesClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/doctypes/{id}");
export const getList = async (): Promise<DocType[]> => {
  const result = await docTypesClient.get();
  return result.data; return result.data;
};

export const add = async (organizationId: string, docType: DocType): Promise<DocType> => {
  const result = await docTypesClient.post({
    params: { organizationId },
    data: docType
  });
  return result.data;
};

export const editDocType = async (organizationId: string, docType: DocType): Promise<DocType> => {
  const result = await docTypesClient.put({
    params: { organizationId, id: docType.id! },
    data: docType
  });
  return result.data;
};

export const deleteDocType = async (organizationId: string, id: number): Promise<void> => {
  await docTypesClient.delete({
    params: { organizationId, id }
  });
};
