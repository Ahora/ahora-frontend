
import AhoraRestCollector from "./base";
import { UserItem } from "./users";

export interface BasicDashboardGadget {
    id?: number;
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

const DashboardGadgetsClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/dashboards/{dashboardId}/gadgets/{id}");
export const getDashboardGadgets = async (dashboardId: number): Promise<DashboardGadget[]> => {
    const result = await DashboardGadgetsClient.get({
        params: { dashboardId }
    });

    return result.data;
}

export const getDashboardGadget = async (dashboardId: number, id: number): Promise<DashboardGadget> => {
    const result = await DashboardGadgetsClient.get({
        params: { id, dashboardId }
    });

    return result.data;
}
export const addDashboardGadget = async (dashboardId: number, dasboard: BasicDashboardGadget): Promise<DashboardGadget> => {
    const result = await DashboardGadgetsClient.post({
        params: { dashboardId },
        data: dasboard
    });
    return result.data;
}

export const updatedGadget = async (dashboardId: number, id: number, dasboard: BasicDashboardGadget): Promise<DashboardGadget> => {
    const result = await DashboardGadgetsClient.put({
        params: { id, dashboardId },
        data: dasboard
    });
    return result.data;
}


export const updateDashboardGadgetTitle = async (dashboardId: number, id: number, title: string): Promise<DashboardGadget> => {
    const result = await DashboardGadgetsClient.put({
        params: { id, },
        data: { title }
    });
    return result.data;
}


export const deleteDashboardGadget = async (id: number): Promise<void> => {
    await DashboardGadgetsClient.delete({
        params: { id }
    });
}