
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



const docsClient: RestCollectorClient = new RestCollectorClient("/api/videos/{id}");
export const getVideos = async (): Promise<Doc[]> => {
    const result = await docsClient.get({
        query: {
            docType: "video"
        }
    });

    return result.data;
}

export const getVideo = async (id: number): Promise<Doc> => {
    const result = await docsClient.get({
        params: {
            id
        }
    });

    return result.data;
}