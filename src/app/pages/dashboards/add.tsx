import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { addDashboard } from 'app/services/dashboard';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Label } from 'app/services/labels';

interface AddDashboardsPageState {
    form: any;
}

interface AddDashboardsPageParams {
    login: string;
}

interface DispatchProps {
}

interface Props extends RouteComponentProps<AddDashboardsPageParams>, DispatchProps {
}

class AddDashboardPage extends React.Component<Props, AddDashboardsPageState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            form: { description: "", title: "" }
        }
    }

    componentDidMount() {
    }

    onLabelsChanged(labels: Label[]) {
        this.setState({ form: { ...this.state.form, labels: labels.map((label) => label.id) } });
    }

    handleEditorChange(text: any) {
        this.setState({ form: { ...this.state.form, description: text } });
    }

    handleChange(event: any) {
        let fieldName = event.target.name;
        let fleldVal = event.target.value;
        this.setState({ form: { ...this.state.form, [fieldName]: fleldVal } });
    }

    async onSubmit(even: any) {
        event!.preventDefault();

        const addedDashboard = await addDashboard(this.state.form);
        this.props.history.replace(`/organizations/${this.props.match.params.login}/dashboards/${addedDashboard.id}`)
    }

    render() {
        return (
            <div>
                <h1>Add DashboardType</h1>
                <Form onSubmit={this.onSubmit.bind(this)}>
                    <Form.Group controlId="exampleForm.title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control name="title" onChange={this.handleChange.bind(this)} type="subject" />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control name="description" onChange={this.handleChange.bind(this)} type="description" />
                    </Form.Group>
                    <Button variant="primary" type="submit">Add</Button>
                </Form>
            </div>
        );
    };
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        organization: state.organizations.currentOrganization
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDashboardPage as any);