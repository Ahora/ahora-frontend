import * as React from 'react';
import { Status, add, deleteStatus, editStatus } from 'app/services/statuses';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { addStatusFromState, deleteStatusFromState, updateStatusToState } from 'app/store/statuses/actions';
import { connect } from 'react-redux';
import { Menu, Space, Table, Button, Input, Popconfirm } from 'antd';

interface StatusRow {
    status: Status;
    editable: boolean;
    name?: string;
    description?: string;
    organizationId?: number;
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
        let statuses: StatusRow[] | undefined = [...this.props.statuses || []];
        if (statuses && this.state.newStatus) {
            statuses = [this.state.newStatus, ...statuses]
        }
        return (
            <div>
                <Menu className="navbar-menu" mode="horizontal">
                    <Space>
                        <Button onClick={this.addnewStatus.bind(this)}>Add new status</Button>
                    </Space>
                </Menu>
                <Table pagination={{ pageSize: 50 }} className="content-toside" dataSource={statuses} rowKey="id">
                    <Table.Column title="Name" dataIndex="name" key="name" render={(text, statusRow: StatusRow) => (
                        <>
                            {
                                statusRow.editable ? (
                                    <Input value={statusRow.name} name="name" onChange={(e: any) => { this.saveData(e, statusRow) }} type="text" />
                                ) : (<>{statusRow.status.name}</>)
                            }
                        </>
                    )} />
                    <Table.Column title="Description" dataIndex="description" key="description" render={(text, statusRow: StatusRow) => (
                        <>
                            {
                                statusRow.editable ? (
                                    <Input value={statusRow.description} name="name" onChange={(e: any) => { this.saveData(e, statusRow) }} type="text" />
                                ) : (<>{statusRow.status.description}</>)
                            }
                        </>
                    )} />
                    <Table.Column title="Actions" render={(text, statusRow: StatusRow) => {

                        const canSave: boolean = !!statusRow.name && statusRow.name.trim().length > 0;
                        return <>
                            {statusRow.editable ? (
                                <Space>
                                    <Button danger onClick={() => { this.cancelEditable(statusRow); }}>Cancel</Button>
                                    <Button disabled={!canSave} onClick={() => { this.saveStatus(statusRow) }}>Save</Button>
                                </Space>)
                                :
                                (<>
                                    {(statusRow.status.organizationId !== null) &&
                                        <Space>
                                            <Button onClick={() => { this.markAsEditable(statusRow); }}>Edit</Button>
                                            <Popconfirm onConfirm={this.onDeleteStatus.bind(this, statusRow)} title="Are you sure?">
                                                <Button danger>Delete</Button>
                                            </Popconfirm>
                                        </Space>
                                    }
                                </>
                                )
                            }
                        </>;
                    }} />
                </Table>
            </div >
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
        addStatusToState: (status: Status) => { dispatch(addStatusFromState(status)) },
        removeStatusFromState: (id: number) => { dispatch(deleteStatusFromState(id)) },
        updateStatusToState: (status: Status) => { dispatch(updateStatusToState(status)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusesPage as any); 