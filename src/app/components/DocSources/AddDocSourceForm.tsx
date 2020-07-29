import * as React from 'react';
import { DocSource, addDocSource } from 'app/services/docSources';
import AhoraForm from '../Forms/AhoraForm/AhoraForm';
import AhoraField from '../Forms/AhoraForm/AhoraField';

interface AddDocSourceFormProps {
    onDocSourceAdded(docSource: DocSource): void;
}

interface State {
    form: any;
    docSources?: DocSource[];
}

export class AddDocSourceForm extends React.Component<AddDocSourceFormProps, State> {
    constructor(props: AddDocSourceFormProps) {
        super(props);
        this.state = {
            form: {}
        }
    }

    cancelAdd() {
        this.setState({
            form: undefined
        });
    }

    async onSubmit(data: any) {
        const addedDocSource = await addDocSource({ organization: data.organization.login, repo: data.repo });
        this.props.onDocSourceAdded(addedDocSource);
        this.setState({
            form: { ...data, repo: "" }
        });
    }

    render() {
        return (
            <AhoraForm submitButtonText="Add" data={this.state.form} onSumbit={this.onSubmit.bind(this)} >
                <AhoraField displayName="Organization or User" fieldName="organization" fieldType="githuborganization"></AhoraField>
                <AhoraField displayName="Repo" fieldName="repo" fieldType="githubrepository"></AhoraField>
            </AhoraForm>
        );
    }
}