import { AhoraFormField } from "app/components/Forms/AhoraForm/data";

export interface DashboardGadgetConfiguration {
    group: string;
    title: string;
    description: string;
    formComponent: { fields?: AhoraFormField[] };
    gadgetComponent: any;
}

export default class DashboardGadgetsSDK {
    private gadgetMap: Map<string, DashboardGadgetConfiguration>;

    constructor() {
        this.gadgetMap = new Map<string, DashboardGadgetConfiguration>();
    }

    public getAllGadgets(): Map<string, DashboardGadgetConfiguration> {
        return this.gadgetMap;
    }

    public registerGadget(gadgetId: string, gadgetDef: DashboardGadgetConfiguration) {
        this.gadgetMap.set(gadgetId.toLowerCase(), gadgetDef);
    }

    public getGadget(gadgetId: string): DashboardGadgetConfiguration | undefined {
        return this.gadgetMap.get(gadgetId.toLowerCase())
    }
}