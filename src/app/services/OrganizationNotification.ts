
import { UserItem } from "./users";
import AhoraRestCollector from "./base";
import { SearchCriterias } from "app/components/SearchDocsInput";


export enum NotificationTrigger {
    OnCreate = 1,
    OnUpdate = 2,
    OnEdit = 4,
    OnComment = 8,
    OnClose = 16,
    onStatusChanged = 32
}

export interface OrganizationNotification {
    id?: number;
    organizationId: number;
    userId: number;
    title: string;
    description: string | null;
    searchCriteria: SearchCriterias;
    trigger: NotificationTrigger;
    owner: UserItem
}


const notificationsClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/notifications/{id}");
export const getNotifications = async (): Promise<OrganizationNotification[]> => {
    const result = await notificationsClient.get({});

    return result.data;
}

export const getNotification = async (id: number): Promise<OrganizationNotification> => {
    const result = await notificationsClient.get({
        params: { id }
    });

    return result.data;
}
export const addNotification = async (notification: OrganizationNotification): Promise<OrganizationNotification> => {
    const result = await notificationsClient.post({
        data: notification
    });
    return result.data;
}

export const updateNotification = async (id: number, notification: OrganizationNotification): Promise<OrganizationNotification> => {
    const result = await notificationsClient.put({
        params: { id },
        data: notification
    });
    return result.data;
}


export const updateNotificationTitle = async (id: number, title: string): Promise<OrganizationNotification> => {
    const result = await notificationsClient.put({
        params: { id, },
        data: { title }
    });
    return result.data;
}

export const updateNotificationDescription = async (id: number, description: string): Promise<OrganizationNotification> => {
    const result = await notificationsClient.put({
        params: { id },
        data: { description }
    });
    return result.data;
}


export const deleteNotification = async (id: number): Promise<void> => {
    await notificationsClient.delete({
        params: { id }
    });
}
