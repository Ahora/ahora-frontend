import { ReactionsState, ReactionActionTypes, UPDATE_REACTION, REACTION_USED } from './types'
import { Reaction } from 'app/services/reactions'

const initialState: ReactionsState = {
    recentReactions: new Set(),
    mapById: new Map<number, Reaction>(),
    loading: false
}

export function labelsReducer(state = initialState, action: ReactionActionTypes): ReactionsState {
    switch (action.type) {
        case UPDATE_REACTION:
            state.mapById.set(action.payload.id, action.payload);
            return { ...state, mapById: new Map(state.mapById) }
        case REACTION_USED:
            state.recentReactions.add(action.payload);
            return { ...state, recentReactions: new Set(state.recentReactions) }

        default:
            return state
    }
}