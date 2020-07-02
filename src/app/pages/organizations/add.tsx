import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { addOrg } from 'app/services/organizations';
import Container from 'react-bootstrap/Container';
import AhoraForm from 'app/components/Forms/AhoraForm/AhoraForm';
import { AhoraFormField } from 'app/components/Forms/AhoraForm/data';

interface AddDocsPageState {
    form: any;
    fields: AhoraFormField[];
}

interface Props extends RouteComponentProps {

}


export default class AddOrganizationPage extends React.Component<Props, AddDocsPageState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            form: {},
            fields: [
                {
                    displayName: "Organization Name",
                    fieldType: "text",
                    fieldName: "displayName",
                },
                {
                    displayName: "Url",
                    fieldType: "organizationurl",
                    fieldName: "login",
                    required: true
                },
                {
                    displayName: "Description",
                    fieldType: "textarea",
                    fieldName: "description"
                }
            ]
        }
    }

    handleChange(event: any) {
        let fieldName = event.target.name;
        let fleldVal = event.target.value;
        this.setState({ form: { ...this.state.form, [fieldName]: fleldVal } })
    }

    async onSubmit(orgData: any) {
        event!.preventDefault();

        try {
            const addedOrg = await addOrg(orgData);
            this.props.history.replace(`/organizations/${addedOrg.login}/new`);
        } catch (error) {
        }
    }

    render() {
        return (
            <Container>
                <h1>Add Organization</h1>
                <AhoraForm submitButtonText="Add" data={this.state.form} onSumbit={this.onSubmit.bind(this)} fields={this.state.fields} />
            </Container>
        );
    };
}