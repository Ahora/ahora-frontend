import DashboardGadgetsSDK from "./DashboardGadgets";
import DocsGraphForm from "app/components/Charts/DocsGraph/form";
import DocsGraphGadget from "app/components/Charts/DocsGraph/graph";

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

export default AhoraSDK;