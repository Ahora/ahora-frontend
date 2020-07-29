import * as React from 'react';
import { OrganizationMilestone, addMilestone, deleteMilestone, reopenMilestone, closeMilestone, MilestoneStatus } from 'app/services/OrganizationMilestones';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import AhoraForm from 'app/components/Forms/AhoraForm/AhoraForm';
import Moment from 'react-moment';
import CanManageOrganization from 'app/components/Authentication/CanManageOrganization';
import { ApplicationState } from 'app/store';
import { requestMilestonesData, addMilestoneFromState, deleteMilestoneFromState, updateMilestoneToState } from 'app/store/milestones/actions';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Button, Table, Typography, Space } from 'antd';
import AhoraField from 'app/components/Forms/AhoraForm/AhoraField';

interface MilestonesPageState {
    form?: any;
}

interface MilestonesPageParams {
    milestones?: OrganizationMilestone[];
    organizationId: string;
}

interface DispatchProps {
    requestMilestoneData(): void;
    addMilestoneToState(milestone: OrganizationMilestone): void,
    updateMilestoneToState(milestone: OrganizationMilestone): void,
    removeMilestoneFromState(id: number): void
}


interface MilestonesPageProps extends MilestonesPageParams, DispatchProps {

}

class MilestonesPage extends React.Component<MilestonesPageProps, MilestonesPageState> {
    constructor(props: MilestonesPageProps) {
        super(props);
        this.state = {

        }
    }

    async onSubmit(data: any) {
        const addedMilestone = await addMilestone(data);
        this.props.addMilestoneToState(addedMilestone);
    }

    async componentDidMount() {
        this.props.requestMilestoneData();
    }

    public openAddForm() {
        this.setState({
            form: {}
        });
    }

    cancelAdd() {
        this.setState({
            form: undefined
        });
    }


    async deleteOrganization(milestone: OrganizationMilestone) {
        await deleteMilestone(milestone.id!);
        this.props.removeMilestoneFromState(milestone.id!);
    }

    async reopen(milestone: OrganizationMilestone) {
        const updatedMilestone = await reopenMilestone(milestone.id!);
        this.props.updateMilestoneToState(updatedMilestone);
    }

    async close(milestone: OrganizationMilestone) {
        const updatedMilestone = await closeMilestone(milestone.id!);
        this.props.updateMilestoneToState(updatedMilestone);
    }

    render() {
        let canManageOrg: boolean = false;
        return (
            <div>


                <Typography.Title>Milestones</Typography.Title>
                <CanManageOrganization>
                    {this.state.form ?
                        <AhoraForm data={this.state.form} onCancel={this.cancelAdd.bind(this)} onSumbit={this.onSubmit.bind(this)}>
                            <AhoraField required={true} fieldName="title" displayName="Title" fieldType="text"></AhoraField>
                            <AhoraField fieldName="description" displayName="Description" fieldType="text"></AhoraField>
                            <AhoraField fieldName="dueOn" displayName="Due On" fieldType="date"></AhoraField>
                        </AhoraForm>
                        :
                        <Button onClick={this.openAddForm.bind(this)}>Add milestone</Button>
                    }
                </CanManageOrganization>

                {(this.props.milestones) ?
                    <Table dataSource={this.props.milestones} rowKey="id">
                        <Table.Column title="Title" dataIndex="title" key="title" />
                        <Table.Column title="Description" dataIndex="description" key="description" />
                        <Table.Column title="ClosedAt" dataIndex="closedAt" key="ClosedAt" render={(value) => <>{value && <Moment date={value} format="YYYY-MM-DD"></Moment>}</>} />
                        <Table.Column title="Due On" dataIndex="dueOn" key="dueOn" render={(value) => <>{value && <Moment date={value} format="YYYY-MM-DD"></Moment>}</>} />
                        {canManageOrg && <Table.Column title="Actions" render={(value: any, milestone: OrganizationMilestone) =>
                            <Space>
                                {milestone.state === MilestoneStatus.open ?
                                    <Button type="primary" onClick={() => { this.close(milestone) }}>Close</Button>
                                    : <Button type="primary" onClick={() => { this.reopen(milestone) }}>Open</Button>
                                }
                                <Button danger onClick={() => { this.deleteOrganization(milestone) }}>Delete</Button>
                            </Space>
                        }></Table.Column>}

                    </Table >
                    :
                    <AhoraSpinner />
                }
            </div>
        );
    };
}


const mapStateToProps = (state: ApplicationState): MilestonesPageParams => {
    return {
        organizationId: state.organizations.currentOrganization!.login,
        milestones: state.milestones.milestones
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestMilestoneData: () => dispatch(requestMilestonesData()),
        addMilestoneToState: (status: OrganizationMilestone) => { dispatch(addMilestoneFromState(status)) },
        removeMilestoneFromState: (id: number) => { dispatch(deleteMilestoneFromState(id)) },
        updateMilestoneToState: (status: OrganizationMilestone) => { dispatch(updateMilestoneToState(status)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MilestonesPage as any); 
