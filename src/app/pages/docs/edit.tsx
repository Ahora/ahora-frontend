import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { updateDoc, Doc, getDoc, deleteDoc } from 'app/services/docs';

interface EditDocPageState {
    form: any;
}

interface EditDocPageParams {
    docType: string;
    login: string;
    id: string;
}

interface Props extends RouteComponentProps<EditDocPageParams> {

}


export default class EditDocPage extends React.Component<Props, EditDocPageState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            form: {}
        }
    }

    async componentDidMount() {
        const doc: Doc = await getDoc(this.props.match.params.login, parseInt(this.props.match.params.id));
        this.setState({ form: doc });
    }

    handleChange(event: any) {
        let fieldName = event.target.name;
        let fleldVal = event.target.value;
        this.setState({ form: { ...this.state.form, [fieldName]: fleldVal } })
    }

    async onSubmit(even: any) {
        event!.preventDefault();

        const updatedDoc: Doc = await updateDoc(this.props.match.params.login, this.state.form.id, this.state.form);
        this.props.history.replace(`/organizations/${this.props.match.params.login}/${this.props.match.params.docType}/${updatedDoc.id}`)
    }


    async onDelete(even: any) {
        event!.preventDefault();

        await deleteDoc(this.props.match.params.login, this.state.form.id);
        this.props.history.replace(`/organizations/${this.props.match.params.login}/${this.props.match.params.docType}`)
    }

    render() {
        return (
            <div>
                <h1>Add {this.props.match.params.docType}</h1>
                <Form onSubmit={this.onSubmit.bind(this)}>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Subject</Form.Label>
                        <Form.Control name="subject" value={this.state.form.subject} onChange={this.handleChange.bind(this)} type="subject" />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control name="description" value={this.state.form.description} onChange={this.handleChange.bind(this)} as="textarea" rows="10" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Save
                    </Button>
                    <Button variant="danger" type="button" onClick={this.onDelete.bind(this)}>
                        Delete
                    </Button>
                </Form>
            </div>
        );
    };
}