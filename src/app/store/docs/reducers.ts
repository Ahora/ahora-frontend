import { DELETE_DOC, DocsActionTypes, DocsState, DocState, SET_DOC } from "./types";

const initialState: DocsState = {
    docs: new Map<number, DocState>()
}

export function docTypesReducer(state = initialState, action: DocsActionTypes): DocsState {
    switch (action.type) {
        case SET_DOC:
            state.docs.set(action.payload.id, { doc: action.payload })
            return state;
        case DELETE_DOC:
            state.docs.delete(action.payload);
            return state;
        default:
            return state;
    }
}
