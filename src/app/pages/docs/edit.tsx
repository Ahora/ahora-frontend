import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { updateDoc, Doc, getDoc, deleteDoc } from 'app/services/docs';
import MarkDownEditor from 'app/components/MarkDownEditor';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { requestDocTypesData } from 'app/store/docTypes/actions';
import { DocType } from 'app/services/docTypes';
import { Label } from 'app/services/labels';
import LabelsSelector from 'app/components/LabelsSelector';

interface EditDocPageState {
    form: any;
}

interface EditDocPageParams {
    login: string;
    id: string;
}

interface DispatchProps {
    requestDocTypes(): void;
}

interface Props extends RouteComponentProps<EditDocPageParams>, DispatchProps {
    docTypes: DocType[];
}

class EditDocPage extends React.Component<Props, EditDocPageState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            form: {}
        }
    }

    async componentDidMount() {
        this.props.requestDocTypes();
        const doc: Doc = await getDoc(this.props.match.params.login, parseInt(this.props.match.params.id));
        this.setState({ form: doc });
    }

    handleEditorChange(text: any) {
        this.setState({ form: { ...this.state.form, description: text } });
    }

    onLabelsChanged(labels: Label[]) {
        this.setState({ form: { ...this.state.form, labels: labels.map((label) => label.id) } });
    }

    handleChange(event: any) {
        let fieldName = event.target.name;
        let fleldVal = event.target.value;
        this.setState({ form: { ...this.state.form, [fieldName]: fleldVal } })
    }

    async onSubmit(even: any) {
        event!.preventDefault();

        const updatedDoc: Doc = await updateDoc(this.props.match.params.login, this.state.form.id, this.state.form);
        this.props.history.replace(`/organizations/${this.props.match.params.login}/docs/${updatedDoc.id}`);
    }


    async onDelete(even: any) {
        event!.preventDefault();

        await deleteDoc(this.props.match.params.login, this.state.form.id);
        this.props.history.replace(`/organizations/${this.props.match.params.login}/docs`);
    }

    render() {
        return (
            <div>
                <h1>Edit</h1>
                <Form onSubmit={this.onSubmit.bind(this)}>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Type</Form.Label>
                        <Form.Control name="docTypeId" value={this.state.form.docTypeId} onChange={this.handleChange.bind(this)} as="select">
                            {this.state.form.docTypeId && <>
                                {this.props.docTypes.map((docType: DocType) => {
                                    return (<option key={docType.id} value={docType.id}>{docType.name}</option>)
                                })}
                            </>
                            }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Subject</Form.Label>
                        <Form.Control name="subject" value={this.state.form.subject} onChange={this.handleChange.bind(this)} type="subject" />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <MarkDownEditor height="400px" value={this.state.form.description} onChange={this.handleEditorChange.bind(this)} />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Labels</Form.Label>
                        <LabelsSelector defaultSelected={this.state.form.labels} onChange={this.onLabelsChanged.bind(this)}></LabelsSelector>
                    </Form.Group>
                    <Button variant="primary" type="submit">Save</Button>
                    <Button variant="danger" type="button" onClick={this.onDelete.bind(this)}>Delete</Button>
                </Form>
            </div >
        );
    };
}


const mapStateToProps = (state: ApplicationState) => {
    return {
        organization: state.organizations.currentOrganization,
        docTypes: state.docTypes.docTypes
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestDocTypes: () => dispatch(requestDocTypesData()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditDocPage as any);