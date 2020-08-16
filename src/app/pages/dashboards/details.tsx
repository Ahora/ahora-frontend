import * as React from 'react';
import { Dashboard, getDashboard, updateDashboardDescription, updateDashboardTitle, updateDashboard, deleteDashboard } from 'app/services/dashboard';
import { RouteComponentProps } from 'react-router';
import EditableHeader from 'app/components/EditableHeader';
import { BasicDashboardGadget } from 'app/services/dashboardGadgets';
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import DashboardGadget from 'app/components/dashboards/DashboardGadget';
import AddGadgetButton from 'app/components/Dashboards/AddGadgetButton';
import { User } from 'app/services/users';
import { Dispatch } from 'redux';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { requestCurrentUserData } from 'app/store/currentuser/actions';
import { canEditDashboard } from 'app/services/authentication';
import { Menu, Button, Space, Popconfirm, Typography } from 'antd';

interface PageGadget {
    isNew: boolean;
    gadget: BasicDashboardGadget
}

interface injectedParams {
    currentUser: User | undefined | null;
}

interface DispatchProps {
    requestCurrentUserData(): void;
}

interface DashboardsDetailsPageState {
    dashboard: Dashboard | null;
    gadgets: PageGadget[];
}

interface DashboardsDetailsPageParams {
    login: string;
    id: string;
}

interface DashboardDetailsPageProps extends RouteComponentProps<DashboardsDetailsPageParams>, injectedParams {

}


interface AllProps extends DashboardDetailsPageProps, DispatchProps {

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
        let dashboard: Dashboard = await getDashboard(parseInt(this.props.match.params.id));

        let gadgets = dashboard.gadgets ? dashboard.gadgets.map((gadget) => {
            return {
                gadget,
                isNew: false
            }
        }) : [];

        this.setState({ dashboard, gadgets });
    }

    async onTitleChanged(value: string) {
        await updateDashboardTitle(this.state.dashboard!.id!, value);
        this.setState({
            dashboard: { ...this.state.dashboard!, title: value },
        });
    }

    async addEmptyGadget(gadgetType: string) {
        this.setState({
            gadgets: [{ isNew: true, gadget: { id: new Date().toISOString(), gadgetType: gadgetType, metadata: {} } }, ...this.state.gadgets]
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
            await updateDashboard(this.state.dashboard.id!, {
                ...this.state.dashboard, gadgets: gadgets.map((g) => { return g.gadget; })
            });
        }
    }

    async onDescriptionChanged(value: string) {
        await updateDashboardDescription(this.state.dashboard!.id!, value);
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
            await updateDashboard(this.state.dashboard.id!, {
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
            const gadgets = reorder(
                this.state.gadgets,
                result.source.index,
                result.destination.index
            );

            this.setState({
                gadgets
            });

            if (this.state.dashboard) {
                updateDashboard(this.state.dashboard?.id!, { ...this.state.dashboard, gadgets: gadgets.map((g) => { return g.gadget; }) });
            }
        }
    }

    async remove() {
        if (this.state.dashboard) {
            await deleteDashboard(this.state.dashboard!.id!);
            this.props.history.replace(`/organizations/${this.props.match.params.login}/dashboards`);
        }
    }

    render() {
        const dashboard: Dashboard | null = this.state.dashboard;
        let canEdit: boolean = false;
        if (dashboard) {
            canEdit = canEditDashboard(this.props.currentUser, dashboard);

        }

        return (
            <div className="wrap-content">
                {dashboard &&
                    <>
                        <EditableHeader canEdit={canEdit} onChanged={this.onTitleChanged.bind(this)} value={dashboard.title}>
                            <Typography.Title>{dashboard.title}</Typography.Title>
                        </EditableHeader>
                        <EditableHeader canEdit={canEdit} onChanged={this.onDescriptionChanged.bind(this)} value={dashboard.description}>{dashboard.description}</EditableHeader>
                        {canEdit &&
                            <Menu mode="horizontal">
                                <Space>
                                    <AddGadgetButton onSelect={this.addEmptyGadget.bind(this)}></AddGadgetButton>
                                    <Popconfirm onConfirm={this.remove.bind(this)} title="Are you sure?">
                                        <Button danger type="primary">Delete dashboard</Button>
                                    </Popconfirm>
                                </Space>
                            </Menu>
                        }
                        <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {this.state.gadgets.map((gadget, index) => (
                                            <Draggable isDragDisabled={!canEdit} key={gadget.gadget.id} draggableId={gadget.gadget.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div key={gadget.gadget.id}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <DashboardGadget canEdit={canEdit} key={gadget.gadget.id} editMode={gadget.isNew} onDelete={this.onGadgetDelete.bind(this)} onUpdate={this.onUpdate.bind(this)} info={gadget.gadget} match={this.props.match} location={this.props.location} history={this.props.history}></DashboardGadget>
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
            </div>
        );
    };
}


const mapStateToProps = (state: ApplicationState): injectedParams => ({
    currentUser: state.currentUser.user
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestCurrentUserData: () => dispatch(requestCurrentUserData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardDetailsPage as any);

