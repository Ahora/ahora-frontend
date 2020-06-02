import { OrganizationMilestone } from "app/services/OrganizationMilestones";

export interface MilestonesState {
    milestones: OrganizationMilestone[],
    loading: boolean,
    map: Map<number, OrganizationMilestone>
}

// src/store/chat/types.ts
export const ADD_MILESTONE = 'ADD_MILESTONE';
export const DELETE_MILESTONE = 'DELETE_MILESTONE';
export const UPDATE_MILESTONE = 'UPDATE_MILESTONE';
export const FETCH_MILESTONES = 'FETCH_MILESTONES';
export const RECEIVE_MILESTONES = 'RECEIVE_MILESTONES';

interface AddMilestoneAction {
    type: typeof ADD_MILESTONE
    payload: OrganizationMilestone
}

interface UpdateMilestoneAction {
    type: typeof UPDATE_MILESTONE
    payload: OrganizationMilestone
}

interface DeleteMilestoneAction {
    type: typeof DELETE_MILESTONE
    meta: {
        id: number
    }
}

interface FetchMilestoneesAction {
    type: typeof RECEIVE_MILESTONES,
    data: OrganizationMilestone[]
}

export type MilestoneActionTypes = AddMilestoneAction | DeleteMilestoneAction | FetchMilestoneesAction | UpdateMilestoneAction