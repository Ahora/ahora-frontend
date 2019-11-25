import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { addDoc } from 'app/services/docs';

interface AddDocsPageState {
    form: any;
}

interface AddDocsPageParams {
    docType: string;
    login: string;
    id: string;
}

interface Props extends RouteComponentProps<AddDocsPageParams> {

}


class AddDocPage extends React.Component<Props, AddDocsPageState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            form: {}
        }
    }

    handleChange(event: any) {
        let fieldName = event.target.name;
        let fleldVal = event.target.value;
        this.setState({ form: { ...this.state.form, [fieldName]: fleldVal } })
    }

    async onSubmit(even: any) {
        event!.preventDefault();

        const addedDoc = await addDoc(this.props.match.params.login, this.props.match.params.docType, this.state.form);
        this.props.history.replace(`/organizations/${this.props.match.params.login}/${this.props.match.params.docType}/${addedDoc.id}`)
    }

    render() {
        return (
            <div>
                <h1>Add {this.props.match.params.docType}</h1>
                <Form onSubmit={this.onSubmit.bind(this)}>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Subject</Form.Label>
                        <Form.Control name="subject" onChange={this.handleChange.bind(this)} type="subject" />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control name="description" onChange={this.handleChange.bind(this)} as="textarea" rows="10" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Add
                    </Button>
                </Form>
            </div>
        );
    };
}

export default AddDocPage;