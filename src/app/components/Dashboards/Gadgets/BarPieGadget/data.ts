import { SearchCriterias } from "app/components/SearchDocsInput";

export enum BarPieGadgetDisplayType {
    bars = "bars",
    pie = "pie"
}

export default interface BarPieGadgetData {
    id?: number;
    searchCriterias?: SearchCriterias;
    primaryGroup?: string;
    secondaryGroup?: string;
    displayType?: BarPieGadgetDisplayType;
}