import { SearchCriterias } from "app/components/SearchDocsInput";
import { Comment } from "app/services/comments";
import { DELETE_COMMENT, COMMENT_ADDED, ADD_COMMENT, REQUEST_COMMENTS, RECEIVE_COMMENTS, RECEIVE_UNREAD_COMMENTS, LOADING_COMMENTS, UPDATE_COMMENT, COMMENT_UPDATED, LOAD_UNREAD_COMMENTS, SET_UNREAD_COMMENTS } from "./types";

export const setCommentAddedInState = (comment: Comment) => ({ type: COMMENT_ADDED, payload: comment });
export const setCommentUpdatedInState = (comment: Comment) => ({ type: COMMENT_UPDATED, payload: comment });
export const receiveUnreadCommentsToState = (docId: number, comments: Comment[]) => ({ type: RECEIVE_UNREAD_COMMENTS, payload: { comments, docId } });
export const setLoadingComments = (docId: number) => ({ type: LOADING_COMMENTS, payload: docId });
export const receiveCommentsToState = (comments: Comment[], docId: number) => ({ type: RECEIVE_COMMENTS, payload: { comments, docId } });
export const AddCommentInState = (comment: Comment, tempCommentId?: number) => ({ type: ADD_COMMENT, payload: { comment, tempCommentId } });
export const deleteCommentInState = (docId: number, commentId: number) => ({ type: DELETE_COMMENT, payload: { docId, commentId } });
export const requestCommentsToState = (docId: number, fromDate?: Date) => ({ type: REQUEST_COMMENTS, payload: { docId, fromDate } });
export const updateCommentInState = (docId: number, comment: Comment) => ({ type: UPDATE_COMMENT, payload: { docId, comment } });
export const loadUnReadComments = (searchCriterias: SearchCriterias) => ({ type: LOAD_UNREAD_COMMENTS, payload: searchCriterias });
export const setCommentsDataInState = (docsItems: { [id: string]: number }) => ({ type: SET_UNREAD_COMMENTS, payload: docsItems });