import { SearchCriterias } from "app/components/SearchDocsInput";
import { OrganizationShortcut } from "app/services/OrganizationShortcut";

export default interface StoreOrganizationShortcut {
    unreadDocs: Set<number>;
    onReadComments?: number;
    layout?: string;
    strict?: boolean;
    searchCriteria: SearchCriterias;
    draftsearchCriteria?: SearchCriterias;
    disableNotification: boolean;
    shortcut?: OrganizationShortcut;
    docs?: Set<number>,
    page?: number;
    totalDocs?: number;

}