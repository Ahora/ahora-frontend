import * as React from 'react';
import { Label, addLabel, deleteLabel, editLabel } from 'app/services/labels';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { addLabelFromState, deleteLabelFromState, updateLabelToState } from 'app/store/labels/actions';
import { connect } from 'react-redux';
import { Menu, Space, Button, Table, Input, Popconfirm } from 'antd';

interface LabelRow {
    label: Label;
    editable: boolean;
    name?: string;
    description?: string;
    color?: string;
    organizationId: number;
}

interface LabelesPageState {
    newLabel?: LabelRow
}

interface LabelPageProps {
    labels?: LabelRow[];
    loading: boolean;
    organizationId: number;
}

interface DispatchProps {
    addLabelToState(label: Label): void,
    updateLabelToState(label: Label): void,
    removeLabelFromState(id: number): void
}

interface AllProps extends LabelPageProps, DispatchProps {

}

class LabelsPage extends React.Component<AllProps, LabelesPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {};
    }

    public markAsEditable(labelRow: LabelRow) {
        labelRow.editable = true;
        labelRow.name = labelRow.label.name;
        labelRow.color = labelRow.label.color;
        labelRow.description = labelRow.label.description || "";
        this.setState({});
    }

    public addnewLabel() {
        this.setState({
            newLabel: {
                editable: true,
                organizationId: this.props.organizationId,
                name: "",
                label: {
                    name: "",
                }
            }
        });
    }

    public cancelEditable(labelRow: LabelRow) {
        if (labelRow.label.id) {
            labelRow.editable = false;
            labelRow.name = labelRow.label.name;
            labelRow.color = labelRow.label.color;
            labelRow.description = labelRow.label.description || "";
            this.setState({});
        }
        else {
            this.setState({
                newLabel: undefined
            });
        }

    }

    public saveData(event: any, label: LabelRow) {
        (label as any)[event.target.name] = event.target.value;
        this.setState({});
    }

    public async saveLabel(label: LabelRow) {
        label.label.name = label.name!;
        label.label.color = label.color;
        label.label.description = label.description!;

        if (label.label.id) {
            await editLabel(label.label);
            this.props.updateLabelToState(label.label);

        }
        else {
            const addedlabel = await addLabel(label.label);
            this.props.addLabelToState(addedlabel);
        }

        this.setState({
            newLabel: undefined
        });
    }

    public async onDeleteLabel(label: LabelRow) {
        await deleteLabel(label.label.id!);
        this.props.removeLabelFromState(label.label.id!);
    }



    render() {
        let labels: LabelRow[] | undefined = [...this.props.labels];
        if (labels && this.state.newLabel) {
            labels = [this.state.newLabel, ...labels]
        }
        return (
            <div>
                <Menu className="navbar-menu" mode="horizontal">
                    <Space>
                        <Button onClick={this.addnewLabel.bind(this)}>Add new label</Button>
                    </Space>
                </Menu>


                <Table pagination={{ pageSize: 50 }} className="content-toside" dataSource={labels} rowKey="id">
                    <Table.Column title="Name" dataIndex="name" key="name" render={(text, labelRow: LabelRow) => (
                        <>
                            {labelRow.editable ? (
                                <Input value={labelRow.name} name="name" onChange={(e: any) => { this.saveData(e, labelRow) }} type="text" />
                            ) : (<>{labelRow.label.name}</>)}
                        </>
                    )} />
                    <Table.Column title="Color" dataIndex="color" key="color" render={(text, labelRow: LabelRow) => (
                        <>
                            {labelRow.editable ? (
                                <Input name="color" value={labelRow.color} onChange={(e: any) => { this.saveData(e, labelRow) }} type="text" />
                            ) : (<>{labelRow.label.color}</>)}
                        </>
                    )} />
                    <Table.Column title="Description" dataIndex="description" key="description" render={(text, labelRow: LabelRow) => (
                        <>
                            {labelRow.editable ? (
                                <Input name="description" value={labelRow.description} onChange={(e: any) => { this.saveData(e, labelRow) }} type="text" />
                            ) : (<>{labelRow.label.description}</>)}
                        </>
                    )} />
                    <Table.Column title="Actions" render={(text, labelRow: LabelRow) => {

                        const canSave: boolean = !!labelRow.name && labelRow.name.trim().length > 0;
                        return <>
                            {labelRow.editable ? (
                                <Space>
                                    <Button danger onClick={() => { this.cancelEditable(labelRow); }}>Cancel</Button>
                                    <Button disabled={!canSave} onClick={() => { this.saveLabel(labelRow) }}>Save</Button>
                                </Space>)
                                :
                                (<Space>
                                    <Button onClick={() => { this.markAsEditable(labelRow); }}>Edit</Button>
                                    <Popconfirm onConfirm={this.onDeleteLabel.bind(this, labelRow)} title="Are you sure?">
                                        <Button danger>Delete</Button>
                                    </Popconfirm>
                                </Space>
                                )
                            }
                        </>;
                    }} />
                </Table>
            </div>
        );
    };
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        organizationId: state.organizations.currentOrganization!.id,
        labels: state.labels.labels.map(label => { return { editable: false, label } }),
        loading: state.labels.loading
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        addLabelToState: (label: Label) => { dispatch(addLabelFromState(label)) },
        removeLabelFromState: (id: number) => { dispatch(deleteLabelFromState(id)) },
        updateLabelToState: (label: Label) => { dispatch(updateLabelToState(label)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LabelsPage as any); 