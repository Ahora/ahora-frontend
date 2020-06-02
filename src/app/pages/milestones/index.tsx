import * as React from 'react';
import { OrganizationMilestone, addMilestone, deleteMilestone, reopenMilestone, closeMilestone, MilestoneStatus } from 'app/services/OrganizationMilestones';
import Table from 'react-bootstrap/Table';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import AhoraForm from 'app/components/Forms/AhoraForm/AhoraForm';
import { AhoraFormField } from 'app/components/Forms/AhoraForm/data';
import Button from 'react-bootstrap/Button';
import Moment from 'react-moment';
import CanManageOrganization from 'app/components/Authentication/CanManageOrganization';
import { ApplicationState } from 'app/store';
import { requestMilestonesData, addMilestoneFromState, deleteMilestoneFromState, updateMilestoneToState } from 'app/store/milestones/actions';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

interface MilestonesPageState {
    form?: any;
    fields: AhoraFormField[];
}

interface MilestonesPageParams {
    milestones?: OrganizationMilestone[];
    loading: boolean;
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
            fields: [{
                displayName: "Title",
                fieldName: "title",
                fieldType: "text",
                required: true
            },
            {
                displayName: "Description",
                fieldName: "description",
                fieldType: "text"
            },
            {
                displayName: "Due On",
                fieldName: "dueOn",
                fieldType: "date"
            }]
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
        return (
            <div>
                <CanManageOrganization>
                    {this.state.form ?
                        <AhoraForm fields={this.state.fields} data={this.state.form} onCancel={this.cancelAdd.bind(this)} onSumbit={this.onSubmit.bind(this)} />
                        :
                        <Button onClick={this.openAddForm.bind(this)}>Add milestone</Button>
                    }
                </CanManageOrganization>

                {!this.props.loading ?
                    <Table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Closed At</th>
                                <th>Due On</th>
                                <CanManageOrganization>
                                    <th></th>
                                </CanManageOrganization>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.milestones && (this.props.milestones.map((milestone: OrganizationMilestone, index: number) => {
                                return (
                                    <tr className="pt-3" key={milestone.id}>
                                        <td>{milestone.title}</td>
                                        <td>{milestone.description}</td>
                                        <td>{milestone.closedAt && <Moment date={milestone.closedAt} format="D MMM YYYY"></Moment>}</td>
                                        <td>{milestone.dueOn && <Moment date={milestone.dueOn} format="D MMM YYYY"></Moment>}</td>
                                        <CanManageOrganization>
                                            <td>
                                                {milestone.state === MilestoneStatus.open ?
                                                    <Button variant="primary" onClick={() => { this.close(milestone) }}>Close</Button>
                                                    : <Button variant="primary" onClick={() => { this.reopen(milestone) }}>Open</Button>
                                                }
                                                <Button variant="danger" onClick={() => { this.deleteOrganization(milestone) }}>Delete</Button></td>
                                        </CanManageOrganization>
                                    </tr>);
                            }))}
                        </tbody>
                    </Table>
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
        milestones: state.milestones.milestones,
        loading: state.milestones.loading
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
