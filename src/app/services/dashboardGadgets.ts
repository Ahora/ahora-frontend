
import { UserItem } from "./users";

export interface BasicDashboardGadget {
    id: string;
    title?: string;
    metadata?: any;
    gadgetType: string;
    location?: number;
    nextGadgetId?: number;
}
export interface DashboardGadget extends BasicDashboardGadget {
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    user: UserItem;
}