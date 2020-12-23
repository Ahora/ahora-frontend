import { Reaction } from "app/services/reactions";

export interface ReactionsState {
    loading: boolean,
    mapById: Map<number, Reaction>;
    recentReactions: Set<number>;
}

export const UPDATE_REACTION = 'UPDATE_REACTION';
export const REQUEST_REACTION = 'REQUEST_REACTION';
export const REACTION_USED = 'REACTION_USED';

export interface UpdateReactionAction {
    type: typeof UPDATE_REACTION
    payload: Reaction
}

interface ReactionUsedAction {
    type: typeof REACTION_USED
    payload: number
}

export interface RequestReactionAction {
    type: typeof REQUEST_REACTION,
    payload: number
}

export type ReactionActionTypes = ReactionUsedAction | RequestReactionAction | UpdateReactionAction