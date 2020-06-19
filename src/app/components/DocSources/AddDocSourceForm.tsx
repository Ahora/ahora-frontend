import * as React from 'react';
import { DocSource, addDocSource } from 'app/services/docSources';
import { AhoraFormField } from '../Forms/AhoraForm/data';
import AhoraForm from '../Forms/AhoraForm/AhoraForm';

interface AddDocSourceFormProps {
    onDocSourceAdded(docSource: DocSource): void;
}

interface State {
    form: any;
    fields: AhoraFormField[];
    docSources?: DocSource[];
}

export class AddDocSourceForm extends React.Component<AddDocSourceFormProps, State> {
    constructor(props: AddDocSourceFormProps) {
        super(props);
        this.state = {
            form: {},
            fields: [
                {
                    displayName: "Organization",
                    fieldName: "organization",
                    fieldType: "githuborganization"
                }, {
                    displayName: "Repo",
                    fieldName: "repo",
                    fieldType: "githubrepository",
                    required: true
                }]
        }
    }

    cancelAdd() {
        this.setState({
            form: undefined
        });
    }

    async onSubmit(data: any) {
        const addedDocSource = await addDocSource(data);
        this.props.onDocSourceAdded(addedDocSource);
        this.setState({
            form: { ...data, repo: "" }
        });
    }

    render() {
        return (
            <AhoraForm submitButtonText="Add" fields={this.state.fields} data={this.state.form} onSumbit={this.onSubmit.bind(this)} />
        );
    }
}