import { SearchCriterias } from "app/components/SearchDocsInput";
import { Comment } from "app/services/comments";
import { REPORT_DOC_READ } from "../shortcuts/types";

export const COMMENT_ADDED = 'COMMENT_ADDED';
export const COMMENT_UPDATED = 'COMMENT_UPDATED';
export const RECEIVE_UNREAD_COMMENTS = 'RECEIVE_UNREAD_COMMENTS';
export const LOADING_COMMENTS = 'LOADING_COMMENTS';
export const ADD_COMMENT = 'ADD_COMMENT';
export const ADD_TEMP_COMMENT = 'ADD_TEMP_COMMENT';
export const REQUEST_COMMENTS = 'REQUEST_COMMENTS';
export const REQUEST_READ_COMMENTS = 'REQUEST_READ_COMMENTS';
export const REQUEST_UNREAD_COMMENTS = 'REQUEST_UNREAD_COMMENTS';
export const RECEIVE_COMMENTS = 'RECEIVE_COMMENTS';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';
export const QOUTE_COMMENT = 'QOUTE_COMMENT';
export const LOAD_UNREAD_COMMENTS = 'LOAD_UNREAD_COMMENTS';
export const SET_UNREAD_COMMENTS = 'SET_UNREAD_COMMENTS';

export interface CommentsState {
    docs: Map<number, DocCommentsState>;
}

export interface DocCommentsState {
    comments?: number[];
    moreComments?: number[];
    unReadCommentsCount: number;
    qouteComment?: Comment
    loading: boolean;
    map: Map<number, Comment>;
}

export interface CommentAddedAction {
    type: typeof COMMENT_ADDED
    payload: Comment
}

export interface CommentUpdatedAction {
    type: typeof COMMENT_UPDATED
    payload: Comment
}

export interface AddCommentAction {
    type: typeof ADD_COMMENT
    payload: {
        tempCommentId: number
        comment: Comment
    }
}

export interface QouteCommentAction {
    type: typeof QOUTE_COMMENT
    payload: Comment
}

export interface LoadUnReadCommentsAction {
    type: typeof LOAD_UNREAD_COMMENTS
    payload: {
        searchCriterias: SearchCriterias,
        since?: Date
    }
}

export interface SetUnReadCommentsAction {
    type: typeof SET_UNREAD_COMMENTS
    payload: { [id: string]: number };
}

export interface RequestCommentsAction {
    type: typeof REQUEST_COMMENTS
    payload: number
}

export interface UpdateCommentAction {
    type: typeof UPDATE_COMMENT
    payload: {
        docId: number;
        comment: Comment
    }
}

interface ReceiveCommentsAction {
    type: typeof RECEIVE_COMMENTS | typeof RECEIVE_UNREAD_COMMENTS,
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


interface LoadingCommentsAction {
    type: typeof LOADING_COMMENTS
    payload: number;
}

export interface ClearUnreadCommentsAction {
    type: typeof REPORT_DOC_READ
    payload: number
}

export type CommentsActionTypes = SetUnReadCommentsAction |
    LoadUnReadCommentsAction |
    UpdateCommentAction |
    ReceiveCommentsAction |
    LoadingCommentsAction |
    RequestCommentsAction |
    CommentUpdatedAction |
    DeletedCommentAction |
    ClearUnreadCommentsAction |
    CommentAddedAction |
    AddCommentAction |
    QouteCommentAction