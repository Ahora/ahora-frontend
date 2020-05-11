import * as React from 'react';
import { Dashboard, getDashboard, updateDashboardDescription, updateDashboardTitle } from 'app/services/dashboard';
import { RouteComponentProps } from 'react-router';
import Container from 'react-bootstrap/Container';
import EditableHeader from 'app/components/EditableHeader';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import EditableGraph from 'app/components/Charts/EditableGraph';
import { updatedGadget, BasicDashboardGadget, addDashboardGadget } from 'app/services/dashboardGadgets';

interface DashboardsDetailsPageState {
    dashboard: Dashboard | null;
    gadgets: BasicDashboardGadget[];
}

interface DashboardsDetailsPageParams {
    login: string;
    id: string;
}

interface DashboardDetailsPageProps extends RouteComponentProps<DashboardsDetailsPageParams> {

}


interface AllProps extends DashboardDetailsPageProps {

}


class DashboardDetailsPage extends React.Component<AllProps, DashboardsDetailsPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            dashboard: null,
            gadgets: []
        }
    }

    async componentDidMount() {
        const dashboard: Dashboard = await getDashboard(parseInt(this.props.match.params.id));
        this.setState({ dashboard, gadgets: dashboard.gadgets });
    }

    async onTitleChanged(value: string) {
        await updateDashboardTitle(this.state.dashboard!.id, value);
        this.setState({
            dashboard: { ...this.state.dashboard!, title: value },
        });
    }

    async addEmptyGadget() {
        this.setState({
            gadgets: [{ gadgetType: "graph", metadata: {} }, ...this.state.gadgets]
        });
    }

    async onUpdate(gadget: BasicDashboardGadget) {

        if (this.state.dashboard) {
            if (gadget.id) {
                await updatedGadget(this.state.dashboard.id, gadget.id, gadget);
            }
            else {
                await addDashboardGadget(this.state.dashboard.id, gadget);
            }
        }

    }

    async onDescriptionChanged(value: string) {
        await updateDashboardDescription(this.state.dashboard!.id, value);
        this.setState({
            dashboard: { ...this.state.dashboard!, description: value },
        });
    }

    render() {
        const dashboard: Dashboard | null = this.state.dashboard;
        return (
            <Container fluid={true}>
                {dashboard &&
                    <>
                        <EditableHeader onChanged={this.onTitleChanged.bind(this)} value={dashboard.title}><h1>{dashboard.title}</h1></EditableHeader>
                        <EditableHeader onChanged={this.onDescriptionChanged.bind(this)} value={dashboard.description}>{dashboard.description}</EditableHeader>
                        <Nav className="mb-3">
                            <Nav.Item>
                                <Button onClick={this.addEmptyGadget.bind(this)} variant="primary" type="button">Add Dadgets</Button>
                            </Nav.Item>
                        </Nav>
                        <div>
                            {this.state.gadgets.map((gadget) =>
                                <div className="mt-2">
                                    <EditableGraph key={gadget.id} onUpdate={this.onUpdate.bind(this)} info={gadget} isNew={!!!gadget.id} history={this.props.history}></EditableGraph>
                                </div>
                            )}

                        </div>
                    </>

                }
            </Container>
        );
    };
}

export default DashboardDetailsPage; 