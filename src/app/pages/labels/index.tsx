import * as React from 'react';
import { Label } from 'app/services/labels';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { requestLabelsData } from 'app/store/labels/actions';


interface LabelRow {
    label: Label;
    editable: boolean;
}

interface LabelsPageState {
    addNewLabel: boolean;
}

interface LabelsPageProps {
    labels: LabelRow[];
    loading: boolean;
}

interface DispatchProps {
    requestLabelsData(): void;
}

interface AllProps extends LabelsPageProps, DispatchProps {

}

class LabelsPage extends React.Component<AllProps, LabelsPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            addNewLabel: false
        };
    }

    async componentDidMount() {

        this.props.requestLabelsData();
        /*
        const labels: Label[] = await getLabels(1);
        const labelRows: LabelRow[] = labels.map((label) => {
            return { label, editable: false };
        });

        this.setState({
            labels: labelRows
        });
        */
    }

    markAsEditable(row: LabelRow) {
        row.editable = true;
        this.setState({

        });
    }

    cancelEditable(row: LabelRow) {
        row.editable = false;
        this.setState({

        });
    }

    toggleAddNew() {
        this.setState({
            addNewLabel: !this.state.addNewLabel
        })
    }

    render() {
        return (
            <div>
                <h2>Labels</h2>
                <Nav>
                    <NavItem>
                        <Button onClick={() => { this.toggleAddNew(); }}>Toogle Add new</Button>
                    </NavItem>
                </Nav>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Color</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                        {this.state.addNewLabel === true ? (
                            <tr>
                                <td><input /></td>
                                <td><input /></td>
                                <td><input /></td>
                                <td><Button>Add</Button></td>
                            </tr>
                        ) : <></>}

                    </thead>
                    <tbody>
                        {this.props.labels.map((labelRow) => {
                            return (
                                <tr className="pt-3" key={labelRow.label.id!}>
                                    <td>{labelRow.label.name}</td>
                                    <td>{labelRow.label.color}</td>
                                    <td>{labelRow.label.description}</td>
                                    <td>
                                        {labelRow.editable ? (
                                            <>
                                                <Button variant="danger" onClick={() => { this.cancelEditable(labelRow); }}>Cancel</Button>
                                                <Button variant="success" onClick={() => { this.markAsEditable(labelRow); }}>Save</Button>
                                            </>)
                                            :
                                            (<Button onClick={() => { this.markAsEditable(labelRow); }}>Edit</Button>)}
                                    </td>
                                </tr>);
                        })}

                    </tbody>
                </table>
            </div>
        );
    };
}


const mapStateToProps = (store: ApplicationState) => {
    return {
        labels: store.labels.labels.map(label => { return { editable: false, label } }),
        loading: store.labels.loading
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        requestLabelsData: () => dispatch(requestLabelsData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LabelsPage as any); 