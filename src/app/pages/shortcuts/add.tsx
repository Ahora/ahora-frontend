import * as React from 'react';
import { OrganizationShortcut, addShortcut } from 'app/services/OrganizationShortcut';
import AhoraForm from 'app/components/Forms/AhoraForm/AhoraForm';
import { ApplicationState } from 'app/store';
import { addShortcutFromState, } from 'app/store/shortcuts/actions';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import AhoraField from 'app/components/Forms/AhoraForm/AhoraField';
import { RouteComponentProps } from 'react-router';

interface AddShortcutsPageState {
    form?: any;
}

interface AddShortcutsPageParams {
    shortcuts?: OrganizationShortcut[];
    organizationId: string;
}

interface DispatchProps {
    addShortcutToState(shortcut: OrganizationShortcut): void,
}


interface AddShortcutsPageProps extends RouteComponentProps, AddShortcutsPageParams, DispatchProps {

}

class AddShortcutsPage extends React.Component<AddShortcutsPageProps, AddShortcutsPageState> {
    constructor(props: AddShortcutsPageProps) {
        super(props);
        this.state = {

        }
    }

    async onSubmit(data: any) {
        const addedShortcut = await addShortcut(data);
        this.props.addShortcutToState(addedShortcut);
        this.props.history.replace(`/organizations/${this.props.organizationId}/${addedShortcut.id}`);
    }

    cancelAdd() {
        this.props.history.replace(`/organizations/${this.props.organizationId}/shortcuts`);
    }

    render() {
        return (
            <div className="wrap-content">
                <AhoraForm onCancel={this.cancelAdd.bind(this)} data={this.state.form} onSumbit={this.onSubmit.bind(this)}>
                    <AhoraField required={true} fieldName="title" displayName="Title" fieldType="text"></AhoraField>
                    <AhoraField required={true} fieldName="searchCriteria" displayName="Search Criteria" fieldType="searchcriteria"></AhoraField>
                    <AhoraField fieldName="star" displayName="Star" fieldType="boolean"></AhoraField>
                </AhoraForm>
            </div>

        );
    };
}


const mapStateToProps = (state: ApplicationState): AddShortcutsPageParams => {
    return {
        organizationId: state.organizations.currentOrganization!.login,
        shortcuts: state.shortcuts.shortcuts
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        addShortcutToState: (status: OrganizationShortcut) => { dispatch(addShortcutFromState(status)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddShortcutsPage as any); 
