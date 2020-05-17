import { SearchCriterias } from "app/components/SearchDocsInput";

export enum DocsGraphDisplayType {
    bars = "bars",
    pie = "pie"
}

export default interface DocsGraphData {
    id?: number;
    searchCriterias?: SearchCriterias;
    primaryGroup?: string;
    secondaryGroup?: string;
    displayType?: DocsGraphDisplayType;
}