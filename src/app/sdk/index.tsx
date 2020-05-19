import DashboardGadgetsSDK from "./DashboardGadgets";
import DocsGraphForm from "app/components/Charts/DocsGraph/form";
import DocsGraphGadget from "app/components/Charts/DocsGraph/graph";
import DocsDateTimeGraphForm from "app/components/Charts/DateTimeChart/form";
import DocsDateTimeGraph from "app/components/Charts/DateTimeChart/graph";

class AhoraSDK {
    private static instance: AhoraSDK;
    public readonly dashboardGadgets: DashboardGadgetsSDK;


    public static getInstance(): AhoraSDK {
        if (!AhoraSDK.instance) {
            AhoraSDK.instance = new AhoraSDK();
        }
        return AhoraSDK.instance;
    }


    constructor() {
        this.dashboardGadgets = new DashboardGadgetsSDK();
    }
}

AhoraSDK.getInstance().dashboardGadgets.registerGadget("docsgraph", {
    title: "Graph",
    description: "Bar or Pie charts",
    group: "General",
    formComponent: DocsGraphForm,
    gadgetComponent: DocsGraphGadget
});

AhoraSDK.getInstance().dashboardGadgets.registerGadget("docsdatetimegraph", {
    title: "Over time Graph",
    description: "Lione Chart",
    group: "General",
    formComponent: DocsDateTimeGraphForm,
    gadgetComponent: DocsDateTimeGraph
});

export default AhoraSDK;