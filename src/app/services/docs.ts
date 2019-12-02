
import { RestCollectorClient } from "rest-collector";
import { SearchCriterias } from "app/components/SearchDocsInput";

export interface Doc {
    id: number;
    subject: string;
    description: string;
    docType: string;
    userAlias: string;
    metadata: any;
    createdAt: Date;
    updatedAt: Date;
    htmlDescription: string;
    status: number;
}


export interface VideoDoc extends Doc {
    metadata: {
        youtubeId: string;
    };
}



const docsClient: RestCollectorClient = new RestCollectorClient("/api/organizations/{login}/docs/{id}");
export const getDocs = async (login: string, docType: string | string[], query?: SearchCriterias): Promise<Doc[]> => {

    const query1: any = query ? {
        label: query.label,
        assignee: query.assignee,
        status: query.status,
        text: query.text,
        docType
    } : { docType };

    const result = await docsClient.get({
        params: { login },
        query: query1
    });

    return result.data;
}

export const getDoc = async (login: string, id: number): Promise<Doc> => {
    const result = await docsClient.get({
        params: {
            id,
            login
        }
    });

    return result.data;
}

export const addDoc = async (login: string, docType: string, doc: Doc): Promise<Doc> => {
    doc.docType = docType;
    const result = await docsClient.post({
        params: { login },
        data: doc
    });
    return result.data;
}

export const updateDoc = async (login: string, id: number, doc: Doc): Promise<Doc> => {
    const result = await docsClient.put({
        params: { login, id },
        data: doc
    });
    return result.data;
}

export const deleteDoc = async (login: string, id: number): Promise<void> => {
    await docsClient.delete({
        params: { login, id }
    });
}