import { Comment } from "app/services/comments";

export const SET_COMMENT = 'SET_COMMENT';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const CLEAR_UNREAD_COMMENTS = 'CLEAR_UNREAD_COMMENTS';

export interface CommentsState {
    docs: Map<number, Map<number, Comment>>;
}

interface SetCommentAction {
    type: typeof SET_COMMENT
    payload: Comment
}


interface DeletedCommentAction {
    type: typeof DELETE_COMMENT
    payload: {
        commentId: number;
        docId: number;
    }
}

interface ClearUnreadCommentsAction {
    type: typeof CLEAR_UNREAD_COMMENTS
    payload: number
}

export type CommentsActionTypes = DeletedCommentAction | ClearUnreadCommentsAction | SetCommentAction