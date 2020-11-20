import { Comment } from "app/services/comments";
import { DELETE_COMMENT, CLEAR_UNREAD_COMMENTS, SET_COMMENT, ADD_COMMENT, REQUEST_COMMENTS, RECEIVE_COMMENTS } from "./types";

export const setCommentInState = (comment: Comment) => ({ type: SET_COMMENT, payload: comment });
export const receiveCommentsToState = (comments: Comment[], docId: number) => ({ type: RECEIVE_COMMENTS, payload: { comments, docId } });
export const AddCommentInState = (comment: Comment) => ({ type: ADD_COMMENT, payload: comment });
export const clearUnReadCommentsInState = (docId: number) => ({ type: CLEAR_UNREAD_COMMENTS, payload: docId });
export const deleteCommentInState = (docId: number, commentId: number) => ({ type: DELETE_COMMENT, payload: { docId, commentId } });
export const requestCommentsToState = (docId: number, fromDate?: Date) => ({ type: REQUEST_COMMENTS, payload: { docId, fromDate } });
