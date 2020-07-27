import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { addDoc, Doc } from 'app/services/docs';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { DocType } from 'app/services/docTypes';
import { Typography } from 'antd';
import AhoraForm from 'app/components/Forms/AhoraForm/AhoraForm';
import { AhoraFormField } from 'app/components/Forms/AhoraForm/data';

interface AddDocsPageState {
    form: any;
    fields: AhoraFormField[];
}

interface AddDocsPageParams {
    login: string;
}

interface Props extends RouteComponentProps<AddDocsPageParams> {
    docTypes: DocType[];
    onDocAdded: (doc: Doc) => void;
}

class AddDocPage extends React.Component<Props, AddDocsPageState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            form: { description: "" },
            fields: [
                {
                    displayName: "Subject",
                    fieldName: "subject",
                    fieldType: "text",
                    required: true
                },
                {
                    displayName: "Type",
                    fieldName: "docTypeId",
                    fieldType: "doctype",
                    required: true
                },
                {
                    displayName: "Labels",
                    fieldName: "labels",
                    fieldType: "labels"
                },
                {
                    displayName: "Description",
                    fieldName: "description",
                    fieldType: "textarea"
                }]
        }
    }

    async onSubmit(data: any): Promise<void> {
        const addedDoc = await addDoc(this.props.match.params.login, data);
        this.props.onDocAdded(addedDoc);
    }

    render() {
        return (
            <div style={{ padding: "8px" }}>
                <Typography.Title>Add Doc</Typography.Title>
                <AhoraForm fields={this.state.fields} data={this.state.form} onSumbit={this.onSubmit.bind(this)} />
            </div>
        );
    };
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        organization: state.organizations.currentOrganization,
        docTypes: state.docTypes.docTypes
    };
};

export default connect(mapStateToProps, null)(AddDocPage as any);