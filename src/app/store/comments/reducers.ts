import { CLEAR_UNREAD_COMMENTS, CommentsActionTypes, CommentsState, DELETE_COMMENT, SET_COMMENT } from "./types";

const initialState: CommentsState = {
    docs: new Map()
}

export function commentsReducer(state: CommentsState = initialState, action: CommentsActionTypes): CommentsState {
    switch (action.type) {
        case SET_COMMENT:
            console.log(action.payload);
            let commentsMap = state.docs.get(action.payload.docId);
            if (!commentsMap) {
                commentsMap = new Map();
            }
            commentsMap.set(action.payload.id, action.payload);
            state.docs.set(action.payload.docId, commentsMap);
            return { ...state, docs: new Map(state.docs) };
        case DELETE_COMMENT:
            state.docs.get(action.payload.docId)?.delete(action.payload.commentId);
            return { ...state, docs: new Map(state.docs) };
        case CLEAR_UNREAD_COMMENTS:
            state.docs.set(action.payload, new Map());
            return { ...state, docs: new Map(state.docs) };
        default:
            return state;
    }
}
