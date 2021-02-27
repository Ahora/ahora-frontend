import { Doc } from "app/services/docs";
import { REPORT_DOC_READ } from "../shortcuts/types";
import { ADD_WATCHER_TO_DOC, DELETE_DOC, DELETE_WATCHER_FROM_DOC, DocsActionTypes, DocsState, SET_DOC, SET_DOCS, SET_DOC_STAR } from "./types";

const initialState: DocsState = {
    docs: new Map<number, Doc>()
}

export function docsReducer(state = initialState, action: DocsActionTypes): DocsState {
    switch (action.type) {
        case SET_DOC:
            state.docs.set(action.payload.id, action.payload)
            return { ...state, docs: new Map(state.docs) };
        case REPORT_DOC_READ:
            let doc = state.docs.get(action.payload);
            if (doc) {
                doc = { ...doc, lastView: { ...(doc.lastView || { star: false }), updatedAt: new Date() } }
                state.docs.set(action.payload, doc);
            }
            return { ...state, docs: new Map(state.docs) };
        case SET_DOC_STAR:
            let docStar = state.docs.get(action.payload.docId);
            if (docStar) {
                docStar = { ...docStar, lastView: { star: action.payload.star, updatedAt: new Date() } };
                state.docs.set(action.payload.docId, docStar);
            }
            return { ...state, docs: new Map(state.docs) };
        case SET_DOCS:
            for (let index = 0; index < action.payload.length; index++) {
                const doc = action.payload[index];
                state.docs.set(doc.id, doc)
            }
            return { ...state, docs: new Map(state.docs) };
        case DELETE_WATCHER_FROM_DOC:
            const deleteWatchreDoc = state.docs.get(action.payload.docId);
            if (deleteWatchreDoc) {
                state.docs.set(action.payload.docId, {
                    ...deleteWatchreDoc,
                    watchers: deleteWatchreDoc.watchers.filter((currentUserId) => currentUserId !== action.payload.userId)
                })
            }
            return { ...state, docs: new Map(state.docs) };
        case ADD_WATCHER_TO_DOC:
            const addWatchreDoc = state.docs.get(action.payload.docId);
            if (addWatchreDoc) {
                state.docs.set(action.payload.docId, {
                    ...addWatchreDoc,
                    watchers: [action.payload.userId, ...addWatchreDoc.watchers]
                })
            }
            return { ...state, docs: new Map(state.docs) };
        case DELETE_DOC:
            state.docs.delete(action.payload);
            return { ...state, docs: new Map(state.docs) };
        default:
            return state;
    }
}
