import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { addDoc, Doc } from 'app/services/docs';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import AhoraForm from 'app/components/Forms/AhoraForm/AhoraForm';
import AhoraField from 'app/components/Forms/AhoraForm/AhoraField';
import { Dispatch } from 'redux';
import { rememberLastDocTypeId } from 'app/store/docTypes/actions';

interface AddDocsPageState {
    form: any;
}

interface AddDocsPageParams {
    login: string;
}

interface DispatchProps {
    setLastDocTypeId: (docTypeId: number) => void;
}

interface Props extends RouteComponentProps<AddDocsPageParams>, DispatchProps {
    onDocAdded: (doc: Doc) => void;
    onCancel: () => void;
    lastDocTypeId?: number;
}

class AddDocPage extends React.Component<Props, AddDocsPageState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            form: { docTypeId: this.props.lastDocTypeId }
        }
    }

    async onSubmit(data: any): Promise<void> {
        const addedDoc = await addDoc(this.props.match.params.login, data);
        this.props.onDocAdded(addedDoc);
    }

    onUpdate(data: any): void {

        //this.props.setLastDocTypeId(data.docTypeId);
    }

    onCancel() {
        this.props.onCancel();
    }

    render() {
        return (
            <div style={{ padding: "8px" }}>
                <AhoraForm onUpdate={this.onUpdate.bind(this)} data={this.state.form} onCancel={this.onCancel.bind(this)} onSumbit={this.onSubmit.bind(this)}>
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
        lastDocTypeId: state.docTypes.lastDocTypeId
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        setLastDocTypeId: (lastDocId: number) => dispatch(rememberLastDocTypeId(lastDocId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddDocPage as any);