
import AhoraRestCollector from "./base";
import { UserItem } from "./users";
import { BasicDashboardGadget } from "./dashboardGadgets";

export enum DashboardLayout {
    OneColumn = "OneColumn",
    TwoColumn = "TwoColumn"
}

export enum DashboardType {
    Public = 0,
    Private = 1
}

export interface Dashboard {
    id: number;
    organizationId: number;
    teamId: number;
    userId: number;
    user: UserItem;
    title: string;
    description?: string;
    layout: DashboardLayout;
    dashboardType: DashboardType;
    gadgets: BasicDashboardGadget[];
}

const DashboardsClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/dashboards/{id}");
export const getDashboards = async (): Promise<Dashboard[]> => {
    const result = await DashboardsClient.get({});

    return result.data;
}

export const getDashboard = async (id: number): Promise<Dashboard> => {
    const result = await DashboardsClient.get({
        params: { id }
    });

    return result.data;
}
export const addDashboard = async (dasboard: Dashboard): Promise<Dashboard> => {
    const result = await DashboardsClient.post({
        data: dasboard
    });
    return result.data;
}

export const updateDashboard = async (id: number, dasboard: Dashboard): Promise<Dashboard> => {
    const result = await DashboardsClient.put({
        params: { id },
        data: dasboard
    });
    return result.data;
}


export const updateDashboardTitle = async (id: number, title: string): Promise<Dashboard> => {
    const result = await DashboardsClient.put({
        params: { id, },
        data: { title }
    });
    return result.data;
}

export const updateDashboardDescription = async (id: number, description: string): Promise<Dashboard> => {
    const result = await DashboardsClient.put({
        params: { id },
        data: { description }
    });
    return result.data;
}


export const deleteDashboard = async (id: number): Promise<void> => {
    await DashboardsClient.delete({
        params: { id }
    });
}