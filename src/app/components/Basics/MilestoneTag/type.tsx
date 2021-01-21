import { OrganizationMilestone } from "app/services/OrganizationMilestones";

export interface MilestoneProps {
    milestoneId?: number;
}

export interface InjecteableProps {
    milestone?: OrganizationMilestone;
}


export interface MilestoneAllProps extends MilestoneProps, InjecteableProps {

}
