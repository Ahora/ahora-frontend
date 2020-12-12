import { REPORT_DOC_READ } from "../shortcuts/types";
import { ADD_COMMENT, CommentsActionTypes, CommentsState, COMMENT_UPDATED, DELETE_COMMENT, LOADING_COMMENTS, RECEIVE_COMMENTS, RECEIVE_UNREAD_COMMENTS, COMMENT_ADDED, UPDATE_COMMENT, SET_UNREAD_COMMENTS, QOUTE_COMMENT } from "./types";

const initialState: CommentsState = {
    docs: new Map()
}

export function commentsReducer(state: CommentsState = initialState, action: CommentsActionTypes): CommentsState {
    switch (action.type) {
        case COMMENT_UPDATED:
            let docCommentUpdated = state.docs.get(action.payload.docId);
            if (!docCommentUpdated) {
                docCommentUpdated = { map: new Map(), loading: false, unReadCommentsCount: 0 }
            }

            docCommentUpdated.map.set(action.payload.id, action.payload);
            state.docs.set(action.payload.docId, docCommentUpdated);
            return { ...state, docs: new Map(state.docs) };
        case COMMENT_ADDED:
            let docComments = state.docs.get(action.payload.docId);
            if (!docComments) {
                docComments = { map: new Map(), loading: false, unReadCommentsCount: 0 }
            }

            if (!docComments.map.has(action.payload.id)) {
                docComments.unReadCommentsCount = docComments.unReadCommentsCount + 1;
                docComments.moreComments = [...docComments.moreComments || [], action.payload.id];
            }

            docComments.map.set(action.payload.id, action.payload);
            state.docs.set(action.payload.docId, docComments);
            return { ...state, docs: new Map(state.docs) };
        case DELETE_COMMENT:
            const docToDeleteComments = state.docs.get(action.payload.docId);
            if (docToDeleteComments) {
                docToDeleteComments.map.delete(action.payload.commentId);
                docToDeleteComments.comments = docToDeleteComments.comments?.filter((currentCommentId) => currentCommentId !== action.payload.commentId)
                docToDeleteComments.moreComments = docToDeleteComments.moreComments?.filter((currentCommentId) => currentCommentId !== action.payload.commentId)
                state.docs.set(action.payload.docId, docToDeleteComments);
            }

            return { ...state, docs: new Map(state.docs) };
        case QOUTE_COMMENT:
            let docOfQoute = state.docs.get(action.payload.docId);
            if (docOfQoute) {
                state.docs.set(action.payload.docId, { ...docOfQoute, qouteComment: action.payload });
            }

            return { ...state, docs: new Map(state.docs) };
        case ADD_COMMENT:
            let docCommentsAdded = state.docs.get(action.payload.comment.docId);
            docCommentsAdded = docCommentsAdded ? { ...docCommentsAdded } : { map: new Map(), loading: false, unReadCommentsCount: 0 };
            const commentArray = [...docCommentsAdded.comments || [], ...docCommentsAdded.moreComments || []];

            //Replace temp comment once we have id from DB.
            if (action.payload.tempCommentId) {
                docCommentsAdded.map.delete(action.payload.tempCommentId);

                const index = commentArray.lastIndexOf(action.payload.tempCommentId);
                if (index > -1) {
                    commentArray[index] = action.payload.comment.id;
                }
            }
            else {
                commentArray.push(action.payload.comment.id)
            }


            //Update comment in a map and clear more comments.
            docCommentsAdded.map.set(action.payload.comment.id, action.payload.comment);
            docCommentsAdded.comments = commentArray;
            docCommentsAdded.unReadCommentsCount = 0;
            docCommentsAdded.moreComments = undefined;
            state.docs.set(action.payload.comment.docId, docCommentsAdded);
            return { ...state, docs: new Map(state.docs) };
        case REPORT_DOC_READ:
            let clearDocComments = state.docs.get(action.payload);
            if (clearDocComments) {
                clearDocComments = { ...clearDocComments, unReadCommentsCount: 0, comments: [...clearDocComments.comments || [], ...clearDocComments.moreComments || []], moreComments: [] }
                state.docs.set(action.payload, clearDocComments);
            }
            return { ...state, docs: new Map(state.docs) };
        case LOADING_COMMENTS:
            let loadingCommentsDoc = state.docs.get(action.payload);
            loadingCommentsDoc = loadingCommentsDoc ? { ...loadingCommentsDoc, loading: true } : { map: new Map(), loading: true, unReadCommentsCount: 0 };
            state.docs.set(action.payload, loadingCommentsDoc);
            return { ...state, docs: new Map(state.docs) };

        case RECEIVE_UNREAD_COMMENTS:
            let unreadCommentsDoc = state.docs.get(action.payload.docId);
            unreadCommentsDoc = unreadCommentsDoc ? { ...unreadCommentsDoc } : { map: new Map(), loading: false, unReadCommentsCount: 0 };

            const unreadCommentIds: number[] = [];
            action.payload.comments.forEach((comment) => {
                unreadCommentsDoc?.map.set(comment.id, comment);
                unreadCommentIds.push(comment.id);
            });

            unreadCommentsDoc.moreComments = unreadCommentIds;
            unreadCommentsDoc.unReadCommentsCount = unreadCommentIds.length;

            state.docs.set(action.payload.docId, unreadCommentsDoc);

            return { ...state, docs: new Map(state.docs) };
        case RECEIVE_COMMENTS:
            let receivedCommentsDoc = state.docs.get(action.payload.docId);
            receivedCommentsDoc = receivedCommentsDoc ? { ...receivedCommentsDoc, loading: false } : { map: new Map(), loading: false, unReadCommentsCount: 0 };

            if (action.payload.comments.length > 0) {
                const commentIds: number[] = [];
                action.payload.comments.forEach((comment) => {
                    receivedCommentsDoc?.map.set(comment.id, comment);
                    commentIds.push(comment.id);
                });
                receivedCommentsDoc.comments = [...commentIds, ...receivedCommentsDoc.comments || []];
            }
            state.docs.set(action.payload.docId, receivedCommentsDoc);

            return { ...state, docs: new Map(state.docs) };
        case UPDATE_COMMENT:
            let updateCommentsDoc = state.docs.get(action.payload.docId);
            if (updateCommentsDoc) {
                updateCommentsDoc.map.set(action.payload.comment.id, action.payload.comment);
            }
            return { ...state, docs: new Map(state.docs) };
        case SET_UNREAD_COMMENTS:
            for (const key in action.payload) {
                if (Object.prototype.hasOwnProperty.call(action.payload, key)) {
                    const element: number = action.payload[key];
                    const docId = parseInt(key);

                    let forEachCommentObj = state.docs.get(docId);
                    forEachCommentObj = forEachCommentObj ? { ...forEachCommentObj, loading: false, unReadCommentsCount: element } : { map: new Map(), loading: false, unReadCommentsCount: element };
                    state.docs.set(docId, forEachCommentObj);
                }
            }
            return { ...state, docs: new Map(state.docs) };
        default:
            return state;
    }
}
