import * as React from 'react'; import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import { Status, add, deleteStatus, editStatus } from 'app/services/statuses';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { requestStatusesData, addStatusFromState, deleteStatusFromState, updateStatusToState } from 'app/store/statuses/actions';
import { connect } from 'react-redux';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

interface StatusRow {
    status: Status;
    editable: boolean;
    name?: string;
    description?: string;
}

interface StatusesPageState {
    newStatus?: StatusRow
}

interface StatusPageProps {
    statuses?: StatusRow[];
    loading: boolean;
    organizationId: string;
}

interface DispatchProps {
    requestStatusData(): void;
    addStatusToState(status: Status): void,
    updateStatusToState(status: Status): void,
    removeStatusFromState(id: number): void
}

interface AllProps extends StatusPageProps, DispatchProps {

}

class StatusesPage extends React.Component<AllProps, StatusesPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        this.props.requestStatusData();
    }

    public markAsEditable(statusRow: StatusRow) {
        statusRow.editable = true;
        statusRow.name = statusRow.status.name;
        statusRow.description = statusRow.status.description || "";
        this.setState({});
    }

    public addnewStatus() {
        this.setState({
            newStatus: {
                editable: true,
                description: "",
                name: "",
                status: {
                    name: "",
                    description: "",
                }
            }
        });
    }

    public cancelEditable(statusRow: StatusRow) {
        if (statusRow.status.id) {
            statusRow.editable = false;
            statusRow.name = statusRow.status.name;
            statusRow.description = statusRow.status.description || "";
            this.setState({});
        }
        else {
            this.setState({
                newStatus: undefined
            });
        }

    }

    public saveData(event: any, status: StatusRow) {
        (status as any)[event.target.name] = event.target.value;
        this.setState({});
    }

    public async saveStatus(status: StatusRow) {
        status.status.name = status.name!;
        status.status.description = status.description!;

        if (status.status.id) {
            await editStatus(this.props.organizationId, status.status);
            this.props.updateStatusToState(status.status);

        }
        else {
            const addedstatus = await add(this.props.organizationId, status.status);
            this.props.addStatusToState(addedstatus);
        }

        this.setState({
            newStatus: undefined
        });
    }

    public async onDeleteStatus(status: StatusRow) {
        await deleteStatus(this.props.organizationId, status.status.id!);
        this.props.removeStatusFromState(status.status.id!);
    }



    render() {
        let statuses: StatusRow[] | undefined = [...this.props.statuses];
        if (statuses && this.state.newStatus) {
            statuses.push(this.state.newStatus);
        }
        return (
            <div>
                <h2>Statuses</h2>
                <Nav>
                    <NavItem>
                        <Button onClick={this.addnewStatus.bind(this)}>Add new status</Button>
                    </NavItem>
                </Nav>
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statuses && (statuses.map((statusRow) => {
                            return (
                                <tr className="pt-3" key={statusRow.status.id}>
                                    <td>
                                        {statusRow.editable ? (
                                            <Form.Control value={statusRow.name} name="name" onChange={(e: any) => { this.saveData(e, statusRow) }} type="text" />
                                        ) : (<>{statusRow.status.name}</>)}
                                    </td>
                                    <td>
                                        {statusRow.editable ? (
                                            <Form.Control name="description" value={statusRow.description} onChange={(e: any) => { this.saveData(e, statusRow) }} type="text" />
                                        ) : (<>{statusRow.status.description}</>)}
                                    </td>
                                    <td>
                                        {statusRow.editable ? (
                                            <>
                                                <Button variant="danger" onClick={() => { this.cancelEditable(statusRow); }}>Cancel</Button>
                                                <Button variant="success" onClick={() => { this.saveStatus(statusRow) }}>Save</Button>
                                            </>)
                                            :
                                            (<>
                                                <Button onClick={() => { this.markAsEditable(statusRow); }}>Edit</Button>
                                                <Button variant="danger" onClick={() => { this.onDeleteStatus(statusRow); }}>Delete</Button></>)}
                                    </td>
                                </tr>);
                        }))}
                    </tbody>
                </Table>
            </div>
        );
    };
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        organizationId: state.organizations.currentOrganization!.login,
        statuses: state.statuses.statuses.map(status => { return { editable: false, status } }),
        loading: state.statuses.loading
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestStatusData: () => dispatch(requestStatusesData()),
        addStatusToState: (status: Status) => { dispatch(addStatusFromState(status)) },
        removeStatusFromState: (id: number) => { dispatch(deleteStatusFromState(id)) },
        updateStatusToState: (status: Status) => { dispatch(updateStatusToState(status)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusesPage as any); 