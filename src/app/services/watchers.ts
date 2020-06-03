
import { RestCollectorClient } from "rest-collector";

export interface DocWatcher {
    id: number;
    docId: number;
    userId: number;
    watcher: {
        username: string;
        displayName?: string;
    }
}


const watchersClient: RestCollectorClient = new RestCollectorClient("/api/organizations/{login}/docs/{docId}/watchers");
export const getWatchers = async (login: string, docId: number): Promise<DocWatcher[]> => {
    const result = await watchersClient.get({
        params: { login, docId }
    });

    return result.data;
}