import { ReactionActionTypes, UPDATE_REACTION, REQUEST_REACTION } from './types'
import { Reaction } from 'app/services/reactions';

export const updateReactionToState = (newReaction: Reaction): ReactionActionTypes => ({ type: UPDATE_REACTION, payload: newReaction });
export const requestReactionData = (id: number): ReactionActionTypes => ({ type: REQUEST_REACTION, payload: id });
