import { Comment } from "app/services/comments";
import { DELETE_COMMENT, SET_COMMENT, ADD_COMMENT, REQUEST_COMMENTS, RECEIVE_COMMENTS, RECEIVE_UNREAD_COMMENTS, LOADING_COMMENTS, UPDATE_COMMENT } from "./types";

export const setCommentInState = (comment: Comment) => ({ type: SET_COMMENT, payload: comment });
export const receiveUnreadCommentsToState = (docId: number, comments: Comment[]) => ({ type: RECEIVE_UNREAD_COMMENTS, payload: { comments, docId } });
export const setLoadingComments = (docId: number) => ({ type: LOADING_COMMENTS, payload: docId });
export const receiveCommentsToState = (comments: Comment[], docId: number) => ({ type: RECEIVE_COMMENTS, payload: { comments, docId } });
export const AddCommentInState = (comment: Comment) => ({ type: ADD_COMMENT, payload: comment });
export const deleteCommentInState = (docId: number, commentId: number) => ({ type: DELETE_COMMENT, payload: { docId, commentId } });
export const requestCommentsToState = (docId: number, fromDate?: Date) => ({ type: REQUEST_COMMENTS, payload: { docId, fromDate } });
export const updateCommentInState = (docId: number, comment: Comment) => ({ type: UPDATE_COMMENT, payload: { docId, comment } });
