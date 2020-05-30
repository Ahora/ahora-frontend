import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { addOrg } from 'app/services/organizations';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';

interface AddDocsPageState {
    form: any;
}

interface Props extends RouteComponentProps {

}


export default class AddOrganizationPage extends React.Component<Props, AddDocsPageState> {
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

        try {
            const addedOrg = await addOrg(this.state.form);
            this.props.history.replace(`/organizations/${addedOrg.login}`);
        } catch (error) {
        }
    }

    render() {
        return (
            <Container>
                <h1>Add Organization</h1>
                <Form onSubmit={this.onSubmit.bind(this)}>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Organization Name</Form.Label>
                        <Form.Control name="displayName" onChange={this.handleChange.bind(this)} type="text" />
                    </Form.Group>
                    <Form.Group controlId="validationCustomUsername">
                        <Form.Label>Url</Form.Label>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroupPrepend">https://ahora.dev/organizations/</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control name="login" onChange={this.handleChange.bind(this)} type="text" />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Type</Form.Label>
                        <Form.Control name="orgType" onChange={this.handleChange.bind(this)} as="select">
                            <option value="0">Public</option>
                            <option value="1">Private</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control name="description" onChange={this.handleChange.bind(this)} as="textarea" rows="10" />
                    </Form.Group>
                    <Button variant="primary" type="submit">Add</Button>
                </Form>
            </Container>
        );
    };
}