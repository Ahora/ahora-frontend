import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { BasicDashboardGadget } from 'app/services/dashboardGadgets';
import AhoraSDK from 'app/sdk';
import { DashboardGadgetConfiguration } from 'app/sdk/DashboardGadgets';

interface AllProps extends RouteComponentProps {
    info: BasicDashboardGadget;
}

class GadgetFactory extends React.Component<AllProps> {

    private gadgetInstance: DashboardGadgetConfiguration | undefined;

    constructor(props: AllProps) {
        super(props);
        this.gadgetInstance = AhoraSDK.getInstance().dashboardGadgets.getGadget(props.info.gadgetType);
    }

    render() {
        if (this.gadgetInstance) {
            const GadgetGraph: any = this.gadgetInstance.gadgetComponent;
            return React.createElement(GadgetGraph, {
                key: this.props.info.id,
                data: this.props.info.metadata,
                history: this.props.history,
                match: this.props.match,
                location: this.props.location,
            });
        }
        else {
            return <div>Missing Gadget</div>
        }
    }

}

export default GadgetFactory;