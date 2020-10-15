
import AhoraRestCollector from "./base";

export interface Comment {
    id: number;
    docId: number;
    comment: string;
    htmlComment: string;
    createdAt: Date;
    pinned: boolean;
    authorUserId: number;
    parentId?: number;
}


const commentsClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/docs/{docId}/Comments/{id}");
export const getComments = async (login: string, docId: number): Promise<Comment[]> => {
    const result = await commentsClient.get({
        params: { login, docId }
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