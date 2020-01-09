
import { RestCollectorClient } from "rest-collector";

export interface DocWatchers {
    id: number;
    docId: number;
    userId: number;
    user: {
        username: string;
        displayName?: string;
    }
}


const watchersClient: RestCollectorClient = new RestCollectorClient("/api/organizations/{login}/docs/{docId}/watchers");
export const getWatchers = async (login: string, docId: number): Promise<DocWatchers[]> => {
    const result = await watchersClient.get({
        params: { login, docId }
    });

    return result.data;
}