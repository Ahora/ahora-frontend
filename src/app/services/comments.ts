
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

export const addComment = async (login: string, docId: number, comment: string, parentId?: number): Promise<Comment> => {
    const result = await commentsClient.post({
        params: { login, docId },
        data: {
            comment,
            parentId
        }
    });
    return result.data;
}

export const updateComment = async (login: string, docId: number, id: number, comment: string): Promise<Comment> => {
    const result = await commentsClient.put({
        params: { login, docId, id },
        data: {
            comment
        }
    });
    return result.data;
}

export const deleteComment = async (login: string, comment: Comment): Promise<Comment> => {
    const result = await commentsClient.delete({
        params: { login, docId: comment.docId, id: comment.id }
    });
    return result.data;
}

export const pinComment = async (login: string, comment: Comment): Promise<Comment> => {
    const result = await commentsClient.post({
        url: `/api/organizations/${login}/docs/${comment.docId}/comments/${comment.id}/pin`,
        params: { login, docId: comment.docId, id: comment.id },
    });
    return result.data;
}

export const unpinComment = async (login: string, comment: Comment): Promise<Comment> => {
    const result = await commentsClient.post({
        url: `/api/organizations/${login}/docs/${comment.docId}/comments/${comment.id}/unpin`,
    });
    return result.data;
}