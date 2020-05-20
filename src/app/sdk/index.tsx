import DashboardGadgetsSDK from "./DashboardGadgets";
import BarPieGadgetForm from "app/components/Dashboards/Gadgets/BarPieGadget/form";
import BarPieGadgetGadget from "app/components/Dashboards/Gadgets/BarPieGadget/Gadget";
import DocListGadgetForm from "app/components/Dashboards/Gadgets/DocListGadget/form";
import DocListGadget from "app/components/Dashboards/Gadgets/DocListGadget/Gadget";

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

AhoraSDK.getInstance().dashboardGadgets.registerGadget("AhoraBarsPie", {
    title: "Pie or Bars Chart",
    description: "Displays the matching docs as pie or bars chart.",
    group: "General",
    formComponent: BarPieGadgetForm,
    gadgetComponent: BarPieGadgetGadget
});

AhoraSDK.getInstance().dashboardGadgets.registerGadget("AhoraDocList", {
    title: "List of docs",
    description: "Displays list of matching docs.",
    group: "General",
    formComponent: DocListGadgetForm,
    gadgetComponent: DocListGadget
});
/*
AhoraSDK.getInstance().dashboardGadgets.registerGadget("docsdatetimegraph", {
    title: "Over time Graph",
    description: "Lione Chart",
    group: "General",
    formComponent: DocsDateTimeGraphForm,
    gadgetComponent: DocsDateTimeGraph
});
*/
export default AhoraSDK;