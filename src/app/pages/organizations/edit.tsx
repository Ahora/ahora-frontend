import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Organization, updateOrganization, deleteOrganization } from 'app/services/organizations';
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { ApplicationState } from "app/store";
import { setCurrentOrganization } from 'app/store/organizations/actions';
import Spinner from 'react-bootstrap/Spinner';
import InputGroup from 'react-bootstrap/InputGroup';

interface EditOrganizationPageState {
    form: any;
}

interface EditDocPageParams {
}


interface DispatchProps {
    setOrganizationToState(organization: Organization | null): void;
}

interface Props extends RouteComponentProps<EditDocPageParams>, DispatchProps {
    organization?: Organization;
}


class EditOrganizationPage extends React.Component<Props, EditOrganizationPageState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            form: {}
        }
    }

    async componentDidMount() {
        if (this.props.organization) {
            this.setState({ form: { ...this.props.organization } });
        }
    }

    handleChange(event: any) {
        let fieldName = event.target.name;
        let fleldVal = event.target.value;
        this.setState({ form: { ...this.state.form, [fieldName]: fleldVal } })
    }

    async onSubmit(even: any) {
        event!.preventDefault();

        const organization: Organization = await updateOrganization(this.state.form);

        if (this.props.organization!.login !== organization.login) {
            this.props.setOrganizationToState(organization);
            this.props.history.replace(`/organizations/${organization.login}/settings`);
        }
        else {
            this.props.setOrganizationToState(organization);
        }
        alert(`Orgnization ${organization.displayName} update successfully`);

    }


    async onDelete(even: any) {
        event!.preventDefault();

        await deleteOrganization(this.state.form.id);
        this.props.history.replace(`/organizations`)
    }

    render() {
        if (this.props.organization) {
            return (
                <div>
                    <h1>Edit {this.props.organization.displayName}</h1>
                    <Form onSubmit={this.onSubmit.bind(this)}>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Organization Name</Form.Label>
                            <Form.Control value={this.state.form.displayName} name="displayName" onChange={this.handleChange.bind(this)} type="text" />
                        </Form.Group>
                        <Form.Group controlId="validationCustomUsername">
                            <Form.Label>Url</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroupPrepend">https://ahora.dev/organizations/</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control value={this.state.form.login} name="login" onChange={this.handleChange.bind(this)} type="text" />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Type</Form.Label>
                            <Form.Control value={this.state.form.orgType} name="orgType" onChange={this.handleChange.bind(this)} as="select">
                                <option value="0">Public</option>
                                <option value="1">Private</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Description</Form.Label>
                            <Form.Control name="description" value={this.state.form.description} onChange={this.handleChange.bind(this)} as="textarea" rows="10" />
                        </Form.Group>
                        <Button variant="primary" type="submit">Save</Button>
                        <Button variant="danger" type="button" onClick={this.onDelete.bind(this)}>Delete</Button>
                    </Form>
                </div>
            );
        }
        else {
            return (<div className="text-center"><Spinner animation="border" variant="primary" /></div>);
        }
    };
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        organization: state.organizations.currentOrganization
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        setOrganizationToState: (organization: Organization) => {
            dispatch(setCurrentOrganization(organization));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditOrganizationPage as any);
