import DashboardGadgetsSDK from "./DashboardGadgets";
import BarPieGadgetForm from "app/components/Dashboards/Gadgets/BarPieGadget/form";
import BarPieGadgetGadget from "app/components/Dashboards/Gadgets/BarPieGadget/Gadget";
import DocListGadgetForm from "app/components/Dashboards/Gadgets/DocListGadget/form";
import DocListGadget from "app/components/Dashboards/Gadgets/DocListGadget/Gadget";
import RegisterComponent from "./RegisterComponent";
import AhoraTextField from "app/components/Forms/Fields/AhoraTextField";
import AhoraSearchCriteriasField from "app/components/Forms/Fields/SearchCriteriaField";
import AhoraNumberField from "app/components/Forms/Fields/AhoraNumberField";
import AhoraDateField from "app/components/Forms/Fields/AhoraDateField";
import AhoraEnumField from "app/components/Forms/Fields/AhoraEnumField";
import { RouteComponentProps } from "react-router";

class AhoraSDK {
    private static instance: AhoraSDK;
    public readonly dashboardGadgets: DashboardGadgetsSDK;
    public readonly formComponents: RegisterComponent<any>;


    public static getInstance(): AhoraSDK {
        if (!AhoraSDK.instance) {
            AhoraSDK.instance = new AhoraSDK();
        }
        return AhoraSDK.instance;
    }


    constructor() {
        this.dashboardGadgets = new DashboardGadgetsSDK();
        this.formComponents = new RegisterComponent<React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>>();
    }
}

AhoraSDK.getInstance().formComponents.register("default", AhoraTextField);
AhoraSDK.getInstance().formComponents.register("text", AhoraTextField);
AhoraSDK.getInstance().formComponents.register("number", AhoraNumberField);
AhoraSDK.getInstance().formComponents.register("searchcriteria", AhoraSearchCriteriasField);
AhoraSDK.getInstance().formComponents.register("date", AhoraDateField);
AhoraSDK.getInstance().formComponents.register("enum", AhoraEnumField);

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