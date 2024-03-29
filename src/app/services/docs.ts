
import AhoraRestCollector from "../sdk/AhoraRestCollector";
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
    isPrivate: boolean;
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
        star: boolean;
        updatedAt: Date
    }
}

export interface SearchDocResult {
    docs: Doc[],
    totalCount: number;
}

const docsClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/docs/{id}");
const docsunReadCommentsClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/docsunread");
const docStarClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/docs/{id}/star");
const reportDocReadClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/docs/{id}/view");
const watchersClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/docs/{id}/watchers/{userId}");
const docStatusClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/docs/{id}/status");
const docAssignClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/docs/{id}/assignee");
const docIsPrivateClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/docs/{id}/isprivate");

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

export const getDocUnreadMessage = async (searchCriterias: SearchCriterias, since?: Date): Promise<Doc[]> => {
    const result = await docsClient.get({
        query: { ...searchCriterias, unread: true, limit: 2000, updatedAt: since }
    });

    return result.data;
}

export const loadUnreadCommentsNumber = async (searchCriterias: SearchCriterias, since?: Date): Promise<Doc[]> => {
    const result = await docsunReadCommentsClient.get({
        query: { ...searchCriterias, unread: true, updatedAt: since }
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

export const assignDoc = async (id: number, userId: number | null): Promise<UserItem> => {
    const result = await docAssignClient.post({
        params: { id },
        data: { userId }
    });
    return result.data;
}

export const addWatcherToDoc = async (id: number, userId: number): Promise<void> => {
    await watchersClient.post({
        params: { id },
        data: { userId }
    });
}

export const deleteWatcherFromDoc = async (id: number, userId: number): Promise<void> => {
    await watchersClient.delete({
        params: { id, userId }
    });
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

export const updateDoc = async (id: number, doc: Doc): Promise<Doc> => {
    const result = await docsClient.put({
        params: { id },
        data: doc
    });
    return result.data;
}

export const updateDocStatus = async (id: number, statusId: number): Promise<void> => {
    const result = await docStatusClient.post({
        params: { id },
        data: { statusId }
    });
    return result.data;

}

export const updateDocSubject = async (id: number, subject: string): Promise<Doc> => {
    const result = await docsClient.put({
        params: { id },
        data: { subject }
    });
    return result.data;
}

export const updateDocDescription = async (id: number, description: string): Promise<Doc> => {
    const result = await docsClient.put({
        params: { id },
        data: { description }
    });
    return result.data;
}

export const updateDocIsPrivate = async (id: number, isPrivate: boolean): Promise<Doc> => {
    const result = await docIsPrivateClient.post({
        params: { id },
        data: { isPrivate }
    });
    return result.data;
}

export const updateDocStar = async (id: number, star: boolean): Promise<Doc> => {
    const result = await docStarClient.post({
        params: { id },
        data: { star }
    });
    return result.data;
}

export const updateDocLabels = async (id: number, labels?: number[]): Promise<Doc> => {
    const result = await docsClient.put({
        params: { id },
        data: { labels }
    });
    return result.data;
}

export const deleteDoc = async (id: number): Promise<void> => {
    await docsClient.delete({
        params: { id }
    });
}