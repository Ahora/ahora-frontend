import { SearchCriterias } from "app/components/SearchDocsInput";
import { OrganizationShortcut } from "app/services/OrganizationShortcut";

export default interface StoreOrganizationShortcut {
    unReadDocsCount?: number;
    onReadComments?: number;
    searchCriteria: SearchCriterias;
    shortcut?: OrganizationShortcut;
    docs?: number[],
    page?: number;
}