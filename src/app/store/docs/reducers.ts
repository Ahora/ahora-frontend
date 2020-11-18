import { DELETE_DOC, DocsActionTypes, DocsState, DocState, SET_DOC, SET_DOCS } from "./types";

const initialState: DocsState = {
    docs: new Map<number, DocState>()
}

export function docTypesReducer(state = initialState, action: DocsActionTypes): DocsState {
    switch (action.type) {
        case SET_DOC:
            state.docs.set(action.payload.id, { doc: action.payload })
            return state;
        case SET_DOCS:
            for (let index = 0; index < action.payload.length; index++) {
                const doc = action.payload[index];
                state.docs.set(doc.id, { doc })
            }
            return state;
        case DELETE_DOC:
            state.docs.delete(action.payload);
            return state;
        default:
            return state;
    }
}
