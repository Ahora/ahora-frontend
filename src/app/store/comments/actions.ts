import { Comment } from "app/services/comments";
import { DELETE_COMMENT, CLEAR_UNREAD_COMMENTS, SET_COMMENT } from "./types";

export const setCommentInState = (comment: Comment) => ({ type: SET_COMMENT, payload: comment });
export const clearUnReadCommentsInState = (docId: number) => ({ type: CLEAR_UNREAD_COMMENTS, payload: docId });
export const deleteCommentInState = (docId: number, commentId: number) => ({ type: DELETE_COMMENT, payload: { docId, commentId } });
