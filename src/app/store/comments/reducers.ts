import { ADD_COMMENT, CLEAR_UNREAD_COMMENTS, CommentsActionTypes, CommentsState, DELETE_COMMENT, RECEIVE_COMMENTS, SET_COMMENT } from "./types";

const initialState: CommentsState = {
    docs: new Map()
}

export function commentsReducer(state: CommentsState = initialState, action: CommentsActionTypes): CommentsState {
    switch (action.type) {
        case SET_COMMENT:
            let docComments = state.docs.get(action.payload.docId);
            if (!docComments) {
                docComments = { map: new Map() }
            }
            docComments.map.set(action.payload.id, action.payload);
            docComments.moreComments = [...docComments.moreComments || [], action.payload];
            state.docs.set(action.payload.docId, docComments);
            return { ...state, docs: new Map(state.docs) };
        case DELETE_COMMENT:
            const docToDeleteComments = state.docs.get(action.payload.docId);
            if (docToDeleteComments) {
                docToDeleteComments.map.delete(action.payload.commentId);
                docToDeleteComments.comments = docToDeleteComments.comments?.filter((currentDoc) => currentDoc.id !== action.payload.commentId)
                docToDeleteComments.moreComments = docToDeleteComments.moreComments?.filter((currentDoc) => currentDoc.id !== action.payload.commentId)
                state.docs.set(action.payload.docId, docToDeleteComments)
            }

            return { ...state, docs: new Map(state.docs) };
        case ADD_COMMENT:
            let docCommentsAdded = state.docs.get(action.payload.docId);
            if (!docCommentsAdded) {
                docCommentsAdded = { map: new Map() }
            }

            //Update comment in a map and clear more comments.
            docCommentsAdded.map.set(action.payload.id, action.payload);
            docCommentsAdded.comments = [...docCommentsAdded.comments || [], ...docCommentsAdded.moreComments || [], action.payload]
            docCommentsAdded.moreComments = undefined;
            state.docs.set(action.payload.docId, docCommentsAdded);
            return { ...state, docs: new Map(state.docs) };
        case CLEAR_UNREAD_COMMENTS:
            let clearDocComments = state.docs.get(action.payload);
            if (clearDocComments) {
                clearDocComments = { ...clearDocComments, comments: [...clearDocComments.comments, ...clearDocComments.moreComments], moreComments: undefined }
                state.docs.set(action.payload, clearDocComments);
            }
            return { ...state, docs: new Map(state.docs) };

        case RECEIVE_COMMENTS:
            let receivedCommentsDoc = state.docs.get(action.payload.docId);
            if (!receivedCommentsDoc) {
                receivedCommentsDoc = { map: new Map() }
            }
            receivedCommentsDoc.comments = [...action.payload.comments, ...receivedCommentsDoc.comments || []];
            state.docs.set(action.payload.docId, receivedCommentsDoc);

            return { ...state, docs: new Map(state.docs) };

        default:
            return state;
    }
}
