import { ADD_COMMENT, CLEAR_UNREAD_COMMENTS, CommentsActionTypes, CommentsState, DELETE_COMMENT, RECEIVE_COMMENTS, REQUEST_COMMENTS, SET_COMMENT } from "./types";

const initialState: CommentsState = {
    docs: new Map()
}

export function commentsReducer(state: CommentsState = initialState, action: CommentsActionTypes): CommentsState {
    switch (action.type) {
        case SET_COMMENT:
            let docComments = state.docs.get(action.payload.docId);
            if (!docComments) {
                docComments = { map: new Map(), loading: false }
            }

            if (!docComments.map.has(action.payload.id)) {
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
        case ADD_COMMENT:
            let docCommentsAdded = state.docs.get(action.payload.docId);
            if (!docCommentsAdded) {
                docCommentsAdded = { map: new Map(), loading: false }
            }

            //Update comment in a map and clear more comments.
            docCommentsAdded.map.set(action.payload.id, action.payload);
            docCommentsAdded.comments = [...docCommentsAdded.comments || [], ...docCommentsAdded.moreComments || [], action.payload.id]
            docCommentsAdded.moreComments = undefined;
            state.docs.set(action.payload.docId, docCommentsAdded);
            return { ...state, docs: new Map(state.docs) };
        case CLEAR_UNREAD_COMMENTS:
            let clearDocComments = state.docs.get(action.payload);
            if (clearDocComments) {
                clearDocComments = { ...clearDocComments, comments: [...clearDocComments.comments || [], ...clearDocComments.moreComments || []], moreComments: undefined }
                state.docs.set(action.payload, clearDocComments);
            }
            return { ...state, docs: new Map(state.docs) };
        case REQUEST_COMMENTS:
            let requetCommentsDoc = state.docs.get(action.payload.docId);
            requetCommentsDoc = requetCommentsDoc ? { ...requetCommentsDoc, loading: true } : { map: new Map(), loading: true };
            state.docs.set(action.payload.docId, requetCommentsDoc);
            return { ...state, docs: new Map(state.docs) };

        case RECEIVE_COMMENTS:
            let receivedCommentsDoc = state.docs.get(action.payload.docId);
            if (!receivedCommentsDoc) {
                receivedCommentsDoc = { map: new Map(), loading: false }
            }
            receivedCommentsDoc.loading = false;

            const commentIds: number[] = [];
            action.payload.comments.forEach((comment) => {
                receivedCommentsDoc?.map.set(comment.id, comment);
                commentIds.push(comment.id);
            })

            receivedCommentsDoc.comments = [...commentIds, ...receivedCommentsDoc.comments || []];
            state.docs.set(action.payload.docId, receivedCommentsDoc);

            return { ...state, docs: new Map(state.docs) };

        default:
            return state;
    }
}
