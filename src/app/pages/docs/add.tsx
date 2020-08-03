import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { addDoc, Doc } from 'app/services/docs';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { DocType } from 'app/services/docTypes';
import { Typography } from 'antd';
import AhoraForm from 'app/components/Forms/AhoraForm/AhoraForm';
import AhoraField from 'app/components/Forms/AhoraForm/AhoraField';

interface AddDocsPageState {
    form: any;
}

interface AddDocsPageParams {
    login: string;
}

interface Props extends RouteComponentProps<AddDocsPageParams> {
    docTypes: DocType[];
    onDocAdded: (doc: Doc) => void;
    onCancel: () => void;
}

class AddDocPage extends React.Component<Props, AddDocsPageState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            form: { description: "" }
        }
    }

    async onSubmit(data: any): Promise<void> {
        const addedDoc = await addDoc(this.props.match.params.login, data);
        this.props.onDocAdded(addedDoc);
    }

    onCancel() {
        this.props.onCancel();
    }

    render() {
        return (
            <div style={{ padding: "8px" }}>
                <Typography.Title>Add Doc</Typography.Title>
                <AhoraForm onCancel={this.onCancel.bind(this)} onSumbit={this.onSubmit.bind(this)}>
                    <AhoraField displayName="Subject" fieldName="subject" fieldType="text" required={true}></AhoraField>
                    <AhoraField displayName="Type" fieldName="docTypeId" fieldType="doctype" required={true}></AhoraField>
                    <AhoraField displayName="Labels" fieldName="labels" fieldType="labels"></AhoraField>
                    <AhoraField displayName="Description" fieldName="description" fieldType="markdown"></AhoraField>
                </AhoraForm>
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