
import { RestCollectorClient } from "rest-collector";

export interface Comment {
    id: number;
    docId: number;
    comment: string;
    createdAt: Date;
    userAlias: string;
}


const commentsClient: RestCollectorClient = new RestCollectorClient("/api/organizations/{login}/docs/{docId}/Comments/{id}");
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

export const addComment = async (login: string, docId: number, comment: string): Promise<Comment> => {
    const result = await commentsClient.post({
        params: { login, docId },
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