
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



const docsClient: RestCollectorClient = new RestCollectorClient("/api/docs/{id}");
export const getDocs = async (docType: string | string[]): Promise<Doc[]> => {
    const result = await docsClient.get({
        query: {
            docType: docType
        }
    });

    return result.data;
}

export const getDoc = async (id: number): Promise<Doc> => {
    const result = await docsClient.get({
        params: {
            id
        }
    });

    return result.data;
}