
import AhoraRestCollector from "../sdk/AhoraRestCollector";
import { SearchCriterias } from "app/components/SearchDocsInput";

export interface OrganizationShortcut {
    id?: number;
    organizationId: number;
    userId: number;
    title: string;
    star: boolean;
    muted: boolean;
    searchCriteria: SearchCriterias;
    since?: Date;
}


const notificationsClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/shortcuts/{id}");
export const getShortcuts = async (): Promise<OrganizationShortcut[]> => {
    const result = await notificationsClient.get({});
    return result.data;
}

export const getShortcut = async (id: number): Promise<OrganizationShortcut> => {
    const result = await notificationsClient.get({
        params: { id }
    });

    return result.data;
}
export const addShortcut = async (Shortcut: OrganizationShortcut): Promise<OrganizationShortcut> => {
    const result = await notificationsClient.post({
        data: Shortcut
    });
    return result.data;
}

export const addShortcutSimple = async (title: string, searchCriteria: SearchCriterias): Promise<OrganizationShortcut> => {
    const result = await notificationsClient.post({
        data: { title, searchCriteria }
    });
    return result.data;
}

export const updateShortcut = async (id: number, Shortcut: OrganizationShortcut): Promise<OrganizationShortcut> => {
    const result = await notificationsClient.put({
        params: { id },
        data: Shortcut
    });
    return result.data;
}

export const updateShortcutSearchCriteria = async (id: string, searchCriteria: SearchCriterias): Promise<void> => {
    await notificationsClient.put({
        params: { id },
        data: { searchCriteria }
    });
}

export const updateShortcutStar = async (id: string, star: boolean): Promise<void> => {
    await notificationsClient.put({
        params: { id },
        data: { star }
    });
}

export const updateShortcutTitle = async (id: number, title: string): Promise<OrganizationShortcut> => {
    const result = await notificationsClient.put({
        params: { id, },
        data: { title }
    });
    return result.data;
}

export const deleteShortcut = async (id: string): Promise<void> => {
    await notificationsClient.delete({
        params: { id }
    });
}
