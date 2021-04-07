
import AhoraRestCollector from "../sdk/AhoraRestCollector";

export enum CommentType {
    comment = 0,
    statusChanged = 1,
    isPrivateChanged = 2,
    labelAdded = 3,
    labelRemoved = 4,
    assigneeChanged = 5
}

export interface Comment {
    id: number;
    docId: number;
    comment: string;
    htmlComment: string;
    createdAt: Date;
    pinned: boolean;
    authorUserId: number;
    parentId?: number;
    updatedAt: Date;
    newValue?: number;
    oldValue?: number;
    commentType?: CommentType;
}


const commentsClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/docs/{docId}/Comments/{id}");
const commentsPinClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/docs/{docId}/Comments/{id}/pin");
const commentsUnpinClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/docs/{docId}/Comments/{id}/unpin");

export const getComments = async (docId: number, toDate?: Date | string, fromCreatedAt?: Date): Promise<Comment[]> => {
    const result = await commentsClient.get({
        params: { docId },
        query: {
            createdAt: (toDate instanceof Date) ? toDate.toISOString() : toDate,
            fromCreatedAt: (fromCreatedAt instanceof Date) ? fromCreatedAt.toISOString() : fromCreatedAt
        }
    });

    return result.data;
}

export const getPinnedComments = async (docId: number): Promise<Comment[]> => {
    const result = await commentsClient.get({
        params: { docId },
        query: {
            pinned: true
        }
    });

    return result.data;
}

export const getDoc = async (login: string, docId: number): Promise<Comment> => {
    const result = await commentsClient.get({
        params: {
            docId,
            login
        }
    });

    return result.data;
}

export const addComment = async (docId: number, comment: string, parentId?: number): Promise<Comment> => {
    const result = await commentsClient.post({
        params: { docId },
        data: {
            comment,
            parentId
        }
    });
    return result.data;
}

export const updateComment = async (docId: number, id: number, comment: string): Promise<Comment> => {
    const result = await commentsClient.put({
        params: { docId, id },
        data: {
            comment
        }
    });
    return result.data;
}

export const deleteComment = async (comment: Comment): Promise<Comment> => {
    const result = await commentsClient.delete({
        params: { docId: comment.docId, id: comment.id }
    });
    return result.data;
}

export const pinComment = async (comment: Comment): Promise<Comment> => {
    const result = await commentsPinClient.post({
        params: { docId: comment.docId, id: comment.id },
    });
    return result.data;
}

export const unpinComment = async (comment: Comment): Promise<Comment> => {
    const result = await commentsUnpinClient.post({
        params: { docId: comment.docId, id: comment.id },
    });
    return result.data;
}