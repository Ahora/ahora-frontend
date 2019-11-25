
import { RestCollectorClient } from "rest-collector";

export interface Doc {
    id: number;
    subject: string;
    description: string;
    docType: string;
    userAlias: string;
    metadata: any;
    createdAt: Date;
    updatedAt: Date;
}


export interface VideoDoc extends Doc {
    metadata: {
        youtubeId: string;
    };
}



const docsClient: RestCollectorClient = new RestCollectorClient("/api/organizations/{login}/docs/{id}");
export const getDocs = async (login: string, docType: string | string[]): Promise<Doc[]> => {
    const result = await docsClient.get({
        params: {
            login
        },
        query: {
            docType,
        }
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