import { Doc } from "app/services/docs";
import { REPORT_DOC_READ } from "../shortcuts/types";
import { DELETE_DOC, DocsActionTypes, DocsState, SET_DOC, SET_DOCS } from "./types";

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
                doc = { ...doc, lastView: { updatedAt: new Date() } }
                state.docs.set(action.payload, doc);
            }
            return { ...state, docs: new Map(state.docs) };
        case SET_DOCS:
            for (let index = 0; index < action.payload.length; index++) {
                const doc = action.payload[index];
                state.docs.set(doc.id, doc)
            }
            return { ...state, docs: new Map(state.docs) };
        case DELETE_DOC:
            state.docs.delete(action.payload);
            return { ...state, docs: new Map(state.docs) };
        default:
            return state;
    }
}
