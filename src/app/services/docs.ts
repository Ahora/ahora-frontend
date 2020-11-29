
import AhoraRestCollector from "./base";
import { SearchCriterias } from "app/components/SearchDocsInput";
import { UserItem } from "./users";
import { DocWatcher } from "./watchers";

export interface DocGroup {
    count: number;
    values: string[];
    criteria: string[];
}

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
    closedAt?: Date;
    htmlDescription: string;
    statusId: number;
    milestoneId?: number;
    milestone?: {
        title: string;
    }
    watchers: number[],
    lastView: null | {
        updatedAt: Date
    }

}

export interface SearchDocResult {
    docs: Doc[],
    totalCount: number;
}

const docsClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/docs/{id}");
const reportDocReadClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/docs/{id}/view");
export const getDocs = async (query?: SearchCriterias, offset: number = 0, limit: number = 30): Promise<SearchDocResult> => {
    const result = await docsClient.get({
        query: { ...query, offset, limit }
    });

    return {
        docs: result.data,
        totalCount: parseInt(result.headers["x-total-count"])
    }
}

export const getDocGroup = async (group: string | string[], query?: SearchCriterias, sort?: string, scalar?: string): Promise<DocGroup[]> => {
    const result = await docsClient.get({
        query: { ...query, group, sort: sort, scalar }
    });

    return result.data;
}

export const getDocUnreadMessage = async (searchCriterias: SearchCriterias, shortcutdId: string): Promise<Doc[]> => {
    const result = await docsClient.get({
        query: { ...searchCriterias, unread: true, limit: 2000 }
    });

    return result.data;

}

export const reportDocReadToServer = (id: number) => {
    reportDocReadClient.get({
        params: { id }
    });
}

export const getDoc = async (id: number): Promise<Doc> => {
    const result = await docsClient.get({
        params: { id }
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

export const updateDocStatus = async (login: string, docId: number, statusId: number): Promise<void> => {
    const result = await docsClient.post({
        url: `/api/organizations/${login}/docs/${docId}/status`,
        data: { statusId }
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