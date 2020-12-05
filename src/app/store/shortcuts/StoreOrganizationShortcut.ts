import { SearchCriterias } from "app/components/SearchDocsInput";
import { OrganizationShortcut } from "app/services/OrganizationShortcut";

export default interface StoreOrganizationShortcut {
    unreadDocs?: Map<number, void>;
    onReadComments?: number;
    searchCriteria: SearchCriterias;
    disableNotification: boolean;
    shortcut?: OrganizationShortcut;
    docs?: Set<number>,
    page?: number;
    totalDocs?: number;
}