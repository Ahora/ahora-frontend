import { Comment } from "app/services/comments";

export const SET_COMMENT = 'SET_COMMENT';
export const ADD_COMMENT = 'ADD_COMMENT';
export const REQUEST_COMMENTS = 'REQUEST_COMMENTS';
export const RECEIVE_COMMENTS = 'RECEIVE_COMMENTS';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const CLEAR_UNREAD_COMMENTS = 'CLEAR_UNREAD_COMMENTS';

export interface CommentsState {
    docs: Map<number, DocCommentsState>;
}

export interface DocCommentsState {
    comments?: Comment[];
    moreComments?: Comment[];
    map: Map<number, Comment>;
}

export interface SetCommentAction {
    type: typeof SET_COMMENT
    payload: Comment
}

export interface AddCommentAction {
    type: typeof ADD_COMMENT
    payload: Comment
}

export interface RequestCommentsAction {
    type: typeof REQUEST_COMMENTS
    payload: {
        docId: number;
        fromDate: number
    }
}

interface ReceiveCommentsAction {
    type: typeof RECEIVE_COMMENTS,
    payload: {
        comments: Comment[],
        docId: number
    }

}

interface DeletedCommentAction {
    type: typeof DELETE_COMMENT
    payload: {
        commentId: number;
        docId: number;
    }
}

export interface ClearUnreadCommentsAction {
    type: typeof CLEAR_UNREAD_COMMENTS
    payload: number
}

export type CommentsActionTypes = ReceiveCommentsAction | RequestCommentsAction | DeletedCommentAction | ClearUnreadCommentsAction | SetCommentAction | AddCommentAction