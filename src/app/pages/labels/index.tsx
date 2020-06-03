import * as React from 'react'; import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import { Label, addLabel, deleteLabel, editLabel } from 'app/services/labels';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { addLabelFromState, deleteLabelFromState, updateLabelToState } from 'app/store/labels/actions';
import { connect } from 'react-redux';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

interface LabelRow {
    label: Label;
    editable: boolean;
    name?: string;
    description?: string;
    color?: string;
}

interface LabelesPageState {
    newLabel?: LabelRow
}

interface LabelPageProps {
    labels?: LabelRow[];
    loading: boolean;
    organizationId: string;
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
            labels.push(this.state.newLabel);
        }
        return (
            <div>
                <h2>Labeles</h2>
                <Nav>
                    <NavItem>
                        <Button onClick={this.addnewLabel.bind(this)}>Add new label</Button>
                    </NavItem>
                </Nav>
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Color</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labels && (labels.map((labelRow) => {
                            return (
                                <tr className="pt-3" key={labelRow.label.id}>
                                    <td>
                                        {labelRow.editable ? (
                                            <Form.Control value={labelRow.name} name="name" onChange={(e: any) => { this.saveData(e, labelRow) }} type="text" />
                                        ) : (<>{labelRow.label.name}</>)}
                                    </td>
                                    <td>
                                        {labelRow.editable ? (
                                            <Form.Control name="color" value={labelRow.color} onChange={(e: any) => { this.saveData(e, labelRow) }} type="text" />
                                        ) : (<>{labelRow.label.color}</>)}
                                    </td>
                                    <td>
                                        {labelRow.editable ? (
                                            <Form.Control name="description" value={labelRow.description} onChange={(e: any) => { this.saveData(e, labelRow) }} type="text" />
                                        ) : (<>{labelRow.label.description}</>)}
                                    </td>

                                    <td>
                                        {labelRow.editable ? (
                                            <>
                                                <Button variant="danger" onClick={() => { this.cancelEditable(labelRow); }}>Cancel</Button>
                                                <Button variant="success" onClick={() => { this.saveLabel(labelRow) }}>Save</Button>
                                            </>)
                                            :
                                            (<>
                                                <Button onClick={() => { this.markAsEditable(labelRow); }}>Edit</Button>
                                                <Button variant="danger" onClick={() => { this.onDeleteLabel(labelRow); }}>Delete</Button></>)}
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