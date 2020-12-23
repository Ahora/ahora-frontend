
import AhoraRestCollector from "../sdk/AhoraRestCollector";


export enum MilestoneStatus {
    open = "open",
    closed = "closed"
}

export interface OrganizationMilestone {
    id?: number;
    title: string;
    description?: string;
    organizationId: number;
    closedAt?: Date;
    dueOn?: Date;
    state: MilestoneStatus;
}


const milestonesClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/milestones/{id}");
export const getMilestones = async (): Promise<OrganizationMilestone[]> => {
    const result = await milestonesClient.get();

    return result.data;
}

export const getMilestone = async (id: number): Promise<OrganizationMilestone> => {
    const result = await milestonesClient.get({
        params: { id }
    });

    return result.data;
}
export const addMilestone = async (milestone: OrganizationMilestone): Promise<OrganizationMilestone> => {
    const result = await milestonesClient.post({ data: milestone });
    return result.data;
}

export const updateMilestone = async (id: number, milestone: OrganizationMilestone): Promise<OrganizationMilestone> => {
    const result = await milestonesClient.put({
        params: { id },
        data: milestone
    });
    return result.data;
}


export const updateMilestoneTitle = async (id: number, title: string): Promise<OrganizationMilestone> => {
    const result = await milestonesClient.put({
        params: { id },
        data: { title }
    });
    return result.data;
}

export const updateMilestoneDescription = async (id: number, description: string): Promise<OrganizationMilestone> => {
    const result = await milestonesClient.put({
        params: { id },
        data: { description }
    });
    return result.data;
}


export const deleteMilestone = async (id: number): Promise<void> => {
    await milestonesClient.delete({
        params: { id },
    });
}

export const reopenMilestone = async (id: number): Promise<OrganizationMilestone> => {
    const result = await milestonesClient.put({

        data: {
            closedAt: null,
            state: MilestoneStatus.open
        },
        params: { id },
    });

    return result.data;
}

export const closeMilestone = async (id: number): Promise<OrganizationMilestone> => {
    const result = await milestonesClient.put({
        data: {
            closedAt: new Date(),
            state: MilestoneStatus.closed
        },
        params: { id },
    });

    return result.data;
}
