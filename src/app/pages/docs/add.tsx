import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { addDoc, Doc } from 'app/services/docs';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import AhoraForm from 'app/components/Forms/AhoraForm/AhoraForm';
import AhoraField from 'app/components/Forms/AhoraForm/AhoraField';
import { Dispatch } from 'redux';
import { rememberLastDocTypeId } from 'app/store/docTypes/actions';
import { FormattedMessage } from 'react-intl';

interface AddDocsPageState {
    form: any;
}

interface AddDocsPageParams {
    login: string;
}

interface InjectableProps {
    lastDocTypeId?: number;

}

interface DispatchProps {
    setLastDocTypeId: (docTypeId: number) => void;
}

interface Props extends RouteComponentProps<AddDocsPageParams>, DispatchProps, InjectableProps {
    onDocAdded: (doc: Doc) => void;
    onCancel: () => void;
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

    onFormUpdate(data: any) {
        this.props.setLastDocTypeId(data.docTypeId);
    }

    onCancel() {
        this.props.onCancel();
    }

    render() {
        return (

            <div style={{ padding: "8px" }}>
                <AhoraForm submitButtonText={<FormattedMessage id="submitButtonText" />} onUpdate={this.onFormUpdate.bind(this)} data={this.state.form} onCancel={this.onCancel.bind(this)} onSumbit={this.onSubmit.bind(this)}>
                    <AhoraField autoFocus={true} displayName={<FormattedMessage id="subjectFieldName" />} fieldName="subject" fieldType="text" required={true}></AhoraField>
                    <AhoraField displayName={<FormattedMessage id="docTypeFieldName" />} fieldName="docTypeId" fieldType="doctype" required={true}></AhoraField>
                    <AhoraField displayName={<FormattedMessage id="labelsFieldName" />} fieldName="labels" fieldType="labels"></AhoraField>
                    <AhoraField displayName={<FormattedMessage id="descriptionFieldName" />} fieldName="description" fieldType="markdown"></AhoraField>
                    <AhoraField displayName={<FormattedMessage id="privateFieldName" />} fieldName="isPrivate" fieldType="boolean"></AhoraField>
                    <AhoraField displayName={<FormattedMessage id="usersFieldName" />} fieldName="users" fieldType="users"></AhoraField>
                </AhoraForm>
            </div >
        );
    };
}

const mapStateToProps = (state: ApplicationState, OwnProps: Props): InjectableProps => {
    return {
        lastDocTypeId: state.docTypes.lastDocTypeId
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        setLastDocTypeId: (lastDocId: number) => dispatch(rememberLastDocTypeId(lastDocId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddDocPage as any);