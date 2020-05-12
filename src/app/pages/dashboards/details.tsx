import * as React from 'react';
import { Dashboard, getDashboard, updateDashboardDescription, updateDashboardTitle } from 'app/services/dashboard';
import { RouteComponentProps } from 'react-router';
import Container from 'react-bootstrap/Container';
import EditableHeader from 'app/components/EditableHeader';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import EditableGraph from 'app/components/Charts/EditableGraph';
import { updatedGadget, BasicDashboardGadget, addDashboardGadget } from 'app/services/dashboardGadgets';
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";


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

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

class DashboardDetailsPage extends React.Component<AllProps, DashboardsDetailsPageState> {

    private newItemCount: number;

    constructor(props: AllProps) {
        super(props);
        this.state = {
            dashboard: null,
            gadgets: []
        }
        this.newItemCount = -1;
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
            gadgets: [{ id: this.newItemCount, gadgetType: "graph", metadata: {} }, ...this.state.gadgets]
        });
        this.newItemCount = this.newItemCount - 1;
    }

    async onUpdate(gadget: BasicDashboardGadget) {

        if (this.state.dashboard) {
            if (gadget.id > 0) {
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
        }



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
                        <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {this.state.gadgets.map((gadget, index) => (
                                            <Draggable key={gadget.id} draggableId={gadget.id!.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div className="mt-2"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <EditableGraph key={gadget.id} onUpdate={this.onUpdate.bind(this)} info={gadget} isNew={gadget.id < 0} history={this.props.history}></EditableGraph>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <div>
                            {this.state.gadgets.map((gadget) =>
                                <div className="mt-2">
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