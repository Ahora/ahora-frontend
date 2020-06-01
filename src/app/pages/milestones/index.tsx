import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { OrganizationMilestone, getMilestones, addMilestone, deleteMilestone, reopenMilestone, MilestoneStatus, closeMilestone } from 'app/services/OrganizationMilestones';
import Table from 'react-bootstrap/Table';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import AhoraForm from 'app/components/Forms/AhoraForm/AhoraForm';
import { AhoraFormField } from 'app/components/Forms/AhoraForm/data';
import Button from 'react-bootstrap/Button';
import Moment from 'react-moment';
import CanManageOrganization from 'app/components/Authentication/CanManageOrganization';

interface MilestonesPageState {
    milestones?: OrganizationMilestone[];
    form?: any;
    fields: AhoraFormField[];
}

interface MilestonesPageParams {
    login: string;
}

interface MilestonesPageProps extends RouteComponentProps<MilestonesPageParams> {

}

interface AllProps extends MilestonesPageProps {

}

class MilestonesPage extends React.Component<AllProps, MilestonesPageState> {
    constructor(props: AllProps) {
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

        this.setState({
            milestones: [addedMilestone, ...this.state.milestones],
            form: undefined
        });
    }

    async componentDidMount() {
        const milestones = await getMilestones();
        this.setState({ milestones });
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
        if (this.state.milestones) {
            this.setState({
                milestones: this.state.milestones.filter((currentMilestone) => currentMilestone.id !== milestone.id)
            });
        }
    }

    async reopen(milestone: OrganizationMilestone, index: number) {
        const updatedMilestone = await reopenMilestone(milestone.id!);
        const milestones = [...this.state.milestones];
        milestones[index] = updatedMilestone;

        this.setState({
            milestones
        });
    }

    async close(milestone: OrganizationMilestone, index: number) {
        const updatedMilestone = await closeMilestone(milestone.id!);
        const milestones = [...this.state.milestones];
        milestones[index] = updatedMilestone;

        this.setState({
            milestones
        });
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

                {this.state.milestones ?
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
                            {this.state.milestones && (this.state.milestones.map((milestone: OrganizationMilestone, index: number) => {
                                return (
                                    <tr className="pt-3" key={milestone.id}>
                                        <td>{milestone.title}</td>
                                        <td>{milestone.description}</td>
                                        <td>{milestone.closedAt && <Moment date={milestone.closedAt} format="D MMM YYYY"></Moment>}</td>
                                        <td>{milestone.dueOn && <Moment date={milestone.dueOn} format="D MMM YYYY"></Moment>}</td>
                                        <CanManageOrganization>

                                            <td>
                                                {milestone.state === MilestoneStatus.open ?
                                                    <Button variant="primary" onClick={() => { this.close(milestone, index) }}>Close</Button>
                                                    : <Button variant="primary" onClick={() => { this.reopen(milestone, index) }}>Open</Button>
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

export default MilestonesPage; 