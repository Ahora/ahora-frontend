import { SearchCriterias } from "app/components/SearchDocsInput";

export default interface DocsDateTimeGraphData {
    id?: number;
    searchCriterias?: SearchCriterias;
    primaryGroup?: string;
    isCompulative: boolean;
}