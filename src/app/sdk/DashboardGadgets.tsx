export interface DashboardGadgetConfiguration {
    group: string;
    title: string;
    description: string;
    formComponent: any;
    gadgetComponent: any;
}

export default class DashboardGadgetsSDK {
    private gadgetMap: Map<string, DashboardGadgetConfiguration>;

    constructor() {
        this.gadgetMap = new Map<string, DashboardGadgetConfiguration>();
    }

    public registerGadget(gadgetId: string, gadgetDef: DashboardGadgetConfiguration) {
        this.gadgetMap.set(gadgetId.toLowerCase(), gadgetDef);
    }

    public getGadget(gadgetId: string): DashboardGadgetConfiguration | undefined {
        return this.gadgetMap.get(gadgetId.toLowerCase())
    }
}