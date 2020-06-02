import { ADD_MILESTONE, RECEIVE_MILESTONES, MilestoneActionTypes, FETCH_MILESTONES, DELETE_MILESTONE, UPDATE_MILESTONE } from './types'
import { OrganizationMilestone } from 'app/services/OrganizationMilestones';

export function addMilestoneFromState(newMilestone: OrganizationMilestone): MilestoneActionTypes {
    return {
        type: ADD_MILESTONE,
        payload: newMilestone
    }
}


export function updateMilestoneToState(newMilestone: OrganizationMilestone): MilestoneActionTypes {
    return {
        type: UPDATE_MILESTONE,
        payload: newMilestone
    }
}

export const requestMilestonesData = () => ({ type: FETCH_MILESTONES });
export const receiveMilestonesData = (data: OrganizationMilestone[]) => ({ type: RECEIVE_MILESTONES, data });

export function deleteMilestoneFromState(id: number): MilestoneActionTypes {
    return {
        type: DELETE_MILESTONE,
        meta: {
            id
        }
    }
}