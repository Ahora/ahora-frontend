import { Comment } from "app/services/comments";
import { REPORT_DOC_READ } from "../shortcuts/types";

export const SET_COMMENT = 'SET_COMMENT';
export const RECEIVE_UNREAD_COMMENTS = 'RECEIVE_UNREAD_COMMENTS';
export const LOADING_COMMENTS = 'LOADING_COMMENTS';
export const ADD_COMMENT = 'ADD_COMMENT';
export const REQUEST_COMMENTS = 'REQUEST_COMMENTS';
export const RECEIVE_COMMENTS = 'RECEIVE_COMMENTS';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';

export interface CommentsState {
    docs: Map<number, DocCommentsState>;
}

export interface DocCommentsState {
    comments?: number[];
    moreComments?: number[];
    loading: boolean;
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

LOADING_COMMENTS

export interface ClearUnreadCommentsAction {
    type: typeof REPORT_DOC_READ
    payload: number
}

export type CommentsActionTypes = UpdateCommentAction | ReceiveCommentsAction | LoadingCommentsAction | RequestCommentsAction | DeletedCommentAction | ClearUnreadCommentsAction | SetCommentAction | AddCommentAction