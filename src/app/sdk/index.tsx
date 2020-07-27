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
import AhoraBitwiseEnumField from "app/components/Forms/Fields/AhoraBitwiseEnumField";
import { RouteComponentProps } from "react-router";
import AhoraRepistoryAutoCompleteField from "app/components/Forms/Fields/RepositoryAutoComplete";
import AhoraOrganizationAutoCompleteField from "app/components/Forms/Fields/OrganizationAutoComplete";
import DocsDateTimeGraphForm from "app/components/Dashboards/Gadgets/DateTimeChart/form";
import DocsDateTimeGraph from "app/components/Dashboards/Gadgets/DateTimeChart/graph";
import AhoraTextAreaField from "app/components/Forms/Fields/AhoraTextAreaField";
import AhoraOrganizationUrlField from "app/components/Forms/Fields/AhoraOrganizationUrlField";
import AhoraContentForm from "app/components/Dashboards/Gadgets/Content/form";
import AhoraContentGadget from "app/components/Dashboards/Gadgets/Content/graph";
import AhoraUserField from "app/components/Forms/Fields/AhoraUserField";
import AhoraTeamUserPermissionField from "app/components/Forms/Fields/AhoraTeamUserPermission";
import AhoraEnumField from "app/components/Forms/Fields/AhoraEnumField";
import AhoraDocTypeField from "app/components/Forms/Fields/AhoraDocTypeField";
import AhoraLabelsField from "app/components/Forms/Fields/AhoraLabelsField";


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
const sdkInstance = AhoraSDK.getInstance();
sdkInstance.formComponents.register("default", AhoraTextField);
sdkInstance.formComponents.register("text", AhoraTextField);
sdkInstance.formComponents.register("textarea", AhoraTextAreaField);
sdkInstance.formComponents.register("number", AhoraNumberField);
sdkInstance.formComponents.register("searchcriteria", AhoraSearchCriteriasField);
sdkInstance.formComponents.register("organizationurl", AhoraOrganizationUrlField);
sdkInstance.formComponents.register("date", AhoraDateField);
sdkInstance.formComponents.register("enumbitwise", AhoraBitwiseEnumField);
sdkInstance.formComponents.register("enum", AhoraEnumField);
sdkInstance.formComponents.register("githubrepository", AhoraRepistoryAutoCompleteField);
sdkInstance.formComponents.register("githuborganization", AhoraOrganizationAutoCompleteField);
sdkInstance.formComponents.register("user", AhoraUserField);
sdkInstance.formComponents.register("teamuserpermission", AhoraTeamUserPermissionField);
sdkInstance.formComponents.register("doctype", AhoraDocTypeField);
sdkInstance.formComponents.register("labels", AhoraLabelsField);


sdkInstance.dashboardGadgets.registerGadget("AhoraBarsPie", {
    title: "Pie or Bars Chart",
    description: "Displays the matching docs as pie or bars chart.",
    group: "General",
    formComponent: BarPieGadgetForm,
    gadgetComponent: BarPieGadgetGadget
});

sdkInstance.dashboardGadgets.registerGadget("AhoraDocList", {
    title: "List of docs",
    description: "Displays list of matching docs.",
    group: "General",
    formComponent: DocListGadgetForm,
    gadgetComponent: DocListGadget
});

sdkInstance.dashboardGadgets.registerGadget("AhoraClosedCreated", {
    title: "Closed & Created over time Graph",
    description: "Line Chart",
    group: "General",
    formComponent: DocsDateTimeGraphForm,
    gadgetComponent: DocsDateTimeGraph
});


sdkInstance.dashboardGadgets.registerGadget("AhoraCustomContent", {
    title: "Custom content",
    description: "Displays custom html content",
    group: "General",
    formComponent: AhoraContentForm,
    gadgetComponent: AhoraContentGadget
});


export default AhoraSDK;