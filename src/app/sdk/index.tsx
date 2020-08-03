import DashboardGadgetsSDK from "./DashboardGadgets";
import BarPieGadgetGadget from "app/components/Dashboards/Gadgets/BarPieGadget/Gadget";
import RegisterComponent from "./RegisterComponent";
import AhoraTextField from "app/components/Forms/Fields/AhoraTextField";
import AhoraSearchCriteriasField from "app/components/Forms/Fields/SearchCriteriaField";
import AhoraNumberField from "app/components/Forms/Fields/AhoraNumberField";
import AhoraDateField from "app/components/Forms/Fields/AhoraDateField";
import AhoraBitwiseEnumField from "app/components/Forms/Fields/AhoraBitwiseEnumField";
import { RouteComponentProps } from "react-router";
import AhoraRepistoryAutoCompleteField from "app/components/Forms/Fields/RepositoryAutoComplete";
import AhoraOrganizationAutoCompleteField from "app/components/Forms/Fields/OrganizationAutoComplete";
import DocsDateTimeGraph from "app/components/Dashboards/Gadgets/DateTimeChart/graph";
import AhoraTextAreaField from "app/components/Forms/Fields/AhoraTextAreaField";
import AhoraOrganizationUrlField from "app/components/Forms/Fields/AhoraOrganizationUrlField";
import AhoraUserField from "app/components/Forms/Fields/AhoraUserField";
import AhoraEnumField from "app/components/Forms/Fields/AhoraEnumField";
import AhoraDocTypeField from "app/components/Forms/Fields/AhoraDocTypeField";
import AhoraLabelsField from "app/components/Forms/Fields/AhoraLabelsField";
import AhoraGroupDocField from "app/components/Forms/Fields/AhoraGroupDocField";
import { BarPieGadgetDisplayType } from "app/components/Dashboards/Gadgets/BarPieGadget/data";
import AhoraContentGadget from "app/components/Dashboards/Gadgets/Content/graph";
import DocListGadget from "app/components/Dashboards/Gadgets/DocListGadget/Gadget";
import AhoraMarkdownField from "app/components/Forms/Fields/AhoraMarkdownField";


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
sdkInstance.formComponents.register("doctype", AhoraDocTypeField);
sdkInstance.formComponents.register("labels", AhoraLabelsField);
sdkInstance.formComponents.register("docsgroup", AhoraGroupDocField);
sdkInstance.formComponents.register("markdown", AhoraMarkdownField);

sdkInstance.dashboardGadgets.registerGadget("AhoraBarsPie", {
    title: "Pie or Bars Chart",
    description: "Displays the matching docs as pie or bars chart.",
    group: "General",
    formComponent: {
        fields: [{
            displayName: "Query",
            fieldName: "searchCriterias",
            fieldType: "searchcriteria",
            required: false
        },
        {
            displayName: "Primary Group",
            fieldName: "primaryGroup",
            fieldType: "docsgroup",
        },
        {
            displayName: "Secondary Group",
            fieldName: "secondaryGroup",
            fieldType: "docsgroup",
        },
        {
            displayName: "display",
            fieldName: "displayType",
            fieldType: "enum",
            settings: {
                enum: BarPieGadgetDisplayType,
                keys: [
                    "bars",
                    "pie"
                ]
            }
        }]
    },
    gadgetComponent: BarPieGadgetGadget
});

sdkInstance.dashboardGadgets.registerGadget("AhoraDocList", {
    title: "List of docs",
    description: "Displays list of matching docs.",
    group: "General",
    formComponent: {
        fields: [{
            displayName: "Query",
            fieldName: "searchCriterias",
            fieldType: "searchcriteria",
            required: false
        },
        {
            displayName: "Number of Docs:",
            fieldName: "numberofdocs",
            fieldType: "number",
        }]
    },
    gadgetComponent: DocListGadget
});

sdkInstance.dashboardGadgets.registerGadget("AhoraClosedCreated", {
    title: "Closed & Created over time Graph",
    description: "Line Chart",
    group: "General",
    formComponent: {
        fields: [{
            displayName: "Query",
            fieldName: "searchCriterias",
            fieldType: "searchcriteria",
            required: false
        },
        {
            displayName: "Primary Group",
            fieldName: "primaryGroup",
            fieldType: "docsgroup",
        }]
    },
    gadgetComponent: DocsDateTimeGraph
});


sdkInstance.dashboardGadgets.registerGadget("AhoraCustomContent", {
    title: "Custom content",
    description: "Displays custom html content",
    group: "General",
    formComponent: {
        fields: [{
            displayName: "Content",
            fieldType: "textarea",
            required: true,
            fieldName: "content"
        }]
    },
    gadgetComponent: AhoraContentGadget
});


export default AhoraSDK;