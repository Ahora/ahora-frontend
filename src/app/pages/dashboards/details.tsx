import * as React from 'react';
import { Dashboard, getDashboard, updateDashboardDescription, updateDashboardTitle, updateDashboard, deleteDashboard } from 'app/services/dashboard';
import { RouteComponentProps } from 'react-router';
import Container from 'react-bootstrap/Container';
import EditableHeader from 'app/components/EditableHeader';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { BasicDashboardGadget } from 'app/services/dashboardGadgets';
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import DashboardGadget from 'app/components/dashboards/DashboardGadget';

interface PageGadget {
    isNew: boolean;
    gadget: BasicDashboardGadget
}

interface DashboardsDetailsPageState {
    dashboard: Dashboard | null;
    gadgets: PageGadget[];
}

interface DashboardsDetailsPageParams {
    login: string;
    id: string;
}

interface DashboardDetailsPageProps extends RouteComponentProps<DashboardsDetailsPageParams> {

}


interface AllProps extends DashboardDetailsPageProps {

}

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

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

        let gadgets = dashboard.gadgets ? dashboard.gadgets.map((gadget) => {
            return {
                gadget,
                isNew: false
            }
        }) : [];

        this.setState({ dashboard, gadgets });
    }

    async onTitleChanged(value: string) {
        await updateDashboardTitle(this.state.dashboard!.id, value);
        this.setState({
            dashboard: { ...this.state.dashboard!, title: value },
        });
    }

    async addEmptyGadget() {
        this.setState({
            gadgets: [{ isNew: true, gadget: { id: new Date().toISOString(), gadgetType: "docsgraph", metadata: {} } }, ...this.state.gadgets]
        });
    }

    async onUpdate(gadget: BasicDashboardGadget) {

        const gadgets = [...this.state.gadgets];
        const index = gadgets.findIndex(x => x.gadget.id === gadget.id);
        gadgets[index].gadget = gadget;

        this.setState({
            gadgets
        });

        if (this.state.dashboard) {
            await updateDashboard(this.state.dashboard.id, {
                ...this.state.dashboard, gadgets: gadgets.map((g) => { return g.gadget; })
            });
        }
    }

    async onDescriptionChanged(value: string) {
        await updateDashboardDescription(this.state.dashboard!.id, value);
        this.setState({
            dashboard: { ...this.state.dashboard!, description: value },
        });
    }

    async onGadgetDelete(gadget: BasicDashboardGadget) {
        var gadgets = [...this.state.gadgets];
        var index = gadgets.findIndex(x => x.gadget.id === gadget.id);
        if (index !== -1 && this.state.dashboard) {
            gadgets.splice(index, 1);
            this.setState({ gadgets });
            await updateDashboard(this.state.dashboard.id, {
                ...this.state.dashboard, gadgets: gadgets.map((g) => { return g.gadget; })
            });
        }
    }

    onDragEnd(result: DropResult) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        if (result.source.index != result.destination.index) {

            /*const draggableGadget: BasicDashboardGadget = this.state.gadgets[result.source.index];
            const afterGadget: BasicDashboardGadget = this.state.gadgets[result.destination.index];
 
 
            console.log(result.source.index, result.destination.index);
            console.log(draggableGadget, afterGadget);
            */

            const gadgets = reorder(
                this.state.gadgets,
                result.source.index,
                result.destination.index
            );

            this.setState({
                gadgets
            });

            if (this.state.dashboard) {
                updateDashboard(this.state.dashboard?.id, { ...this.state.dashboard, gadgets: gadgets.map((g) => { return g.gadget; }) });
            }
        }
    }

    async remove() {
        if (this.state.dashboard) {
            await deleteDashboard(this.state.dashboard!.id);
            this.props.history.replace(`/organizations/${this.props.match.params.login}/dashboards`);
        }
    }

    render() {
        const dashboard: Dashboard | null = this.state.dashboard;
        return (
            <Container fluid={true}>
                {dashboard &&
                    <>
                        <EditableHeader onChanged={this.onTitleChanged.bind(this)} value={dashboard.title}>
                            <h1>{dashboard.title}</h1>
                        </EditableHeader>
                        <EditableHeader onChanged={this.onDescriptionChanged.bind(this)} value={dashboard.description}>{dashboard.description}</EditableHeader>
                        <Nav className="mb-3">
                            <Nav.Item>
                                <Button onClick={this.addEmptyGadget.bind(this)} variant="primary" type="button">Add gadget</Button>
                            </Nav.Item>
                            <Nav.Item>
                                <Button onClick={this.remove.bind(this)} variant="danger" type="button">Delete dashboard</Button>
                            </Nav.Item>
                        </Nav>
                        <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {this.state.gadgets.map((gadget, index) => (
                                            <Draggable key={gadget.gadget.id} draggableId={gadget.gadget.id!.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div key={gadget.gadget.id}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <DashboardGadget key={gadget.gadget.id} editMode={gadget.isNew} onDelete={this.onGadgetDelete.bind(this)} onUpdate={this.onUpdate.bind(this)} info={gadget.gadget} match={this.props.match} location={this.props.location} history={this.props.history}></DashboardGadget>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </>

                }
            </Container>
        );
    };
}

export default DashboardDetailsPage; 