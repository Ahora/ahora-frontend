import { MilestonesState, MilestoneActionTypes, ADD_MILESTONE, DELETE_MILESTONE, RECEIVE_MILESTONES, UPDATE_MILESTONE } from './types'
import { OrganizationMilestone } from 'app/services/OrganizationMilestones';

const initialState: MilestonesState = {
    milestones: [],
    map: new Map<number, OrganizationMilestone>(),
    loading: false
}

export function milestonesReducer(state = initialState, action: MilestoneActionTypes): MilestonesState {
    switch (action.type) {
        case ADD_MILESTONE:
            return { ...state, milestones: [...state.milestones, action.payload] }
        case RECEIVE_MILESTONES:
            const map = new Map<number, OrganizationMilestone>();
            action.data.forEach((milestone) => {
                map.set(milestone.id!, milestone);
            });
            return { ...state, milestones: action.data, map, loading: false }
        case DELETE_MILESTONE:
            return {
                ...state,
                milestones: state.milestones.filter(
                    milestone => milestone.id !== action.meta.id
                )
            }
        case UPDATE_MILESTONE:
            return {
                ...state,
                milestones: state.milestones.map((milestone, i) => milestone.id === action.payload.id ? action.payload : milestone)
            }
        default:
            return state
    }
}