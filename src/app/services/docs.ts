
import AhoraRestCollector from "./base";
import { SearchCriterias } from "app/components/SearchDocsInput";
import { UserItem } from "./users";
import { DocWatcher } from "./watchers";

export interface Doc {
    id: number;
    subject: string;
    description: string;
    docTypeId: number;
    userAlias: string;
    sourceId?: number;
    docSourceId?: number;
    reporterUserId?: number;
    assigneeUserId?: number;
    source?: {
        repo: string;
        organization: string;
        url: string;
    }
    metadata: any;
    createdAt: Date;
    labels?: number[];
    updatedAt: Date;
    commentsNumber: number;
    views: number;
    closedAt: number;
    htmlDescription: string;
    statusId: number;
    milestoneId?: number;
    assignee?: UserItem
    reporter: UserItem,
    milestone?: {
        title: string;
    }
    lastView: null | {
        updatedAt: Date
    }

}

export interface SearchDocResult {
    docs: Doc[],
    totalCount: number;
}

const docsClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/docs/{id}");
export const getDocs = async (query?: SearchCriterias, offset: number = 0, limit: number = 30): Promise<SearchDocResult> => {
    const result = await docsClient.get({
        query: { ...query, offset, limit }
    });

    return {
        docs: result.data,
        totalCount: parseInt(result.headers["x-total-count"])
    }
}

export const getDocGroup = async (group: string | string[], query?: SearchCriterias): Promise<any[]> => {
    const result = await docsClient.get({
        query: { ...query, group }
    });

    return result.data;
}

export const getDoc = async (login: string, id: number): Promise<Doc> => {
    const result = await docsClient.get({
        params: { id, login }
    });

    return result.data;
}

export const assignDoc = async (login: string, id: number, username: string): Promise<UserItem> => {
    const result = await docsClient.post({
        url: `/api/organizations/${login}/docs/${id}/assignee`,
        data: { username }
    });
    return result.data;
}

export const watchDoc = async (login: string, id: number): Promise<DocWatcher> => {
    const result = await docsClient.post({
        url: `/api/organizations/${login}/docs/${id}/watch`
    });
    return result.data;
}

export const unwatchDoc = async (login: string, id: number): Promise<UserItem> => {
    const result = await docsClient.post({
        url: `/api/organizations/${login}/docs/${id}/unwatch`
    });
    return result.data;
}

export const addDoc = async (login: string, doc: Doc): Promise<Doc> => {
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

export const updateDocSubject = async (login: string, id: number, subject: string): Promise<Doc> => {
    const result = await docsClient.put({
        params: { id, login },
        data: { subject }
    });
    return result.data;
}

export const updateDocDescription = async (login: string, id: number, description: string): Promise<Doc> => {
    const result = await docsClient.put({
        params: { id, login },
        data: { description }
    });
    return result.data;
}

export const updateDocLabels = async (login: string, id: number, labels?: number[]): Promise<Doc> => {
    const result = await docsClient.put({
        params: { id, login },
        data: { labels }
    });
    return result.data;
}

export const deleteDoc = async (login: string, id: number): Promise<void> => {
    await docsClient.delete({
        params: { login, id }
    });
}