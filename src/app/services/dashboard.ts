
import AhoraRestCollector from "./base";
import { UserItem } from "./users";

export enum DashboardLayout {
    OneColumn = "OneColumn",
    TwoColumn = "TwoColumn"
}

export interface Dashboard {
    id?: number;
    organizationId: number;
    teamId: number;
    userId: number;
    user: UserItem;
    title?: string;
    description?: string;
    layout: DashboardLayout;
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

export const updateDoc = async (login: string, id: number, dasboard: Dashboard): Promise<Dashboard> => {
    const result = await DashboardsClient.put({
        params: { id },
        data: dasboard
    });
    return result.data;
}

export const deleteDashboard = async (id: number): Promise<void> => {
    await DashboardsClient.delete({
        params: { id }
    });
}