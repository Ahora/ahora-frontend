import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Organization, updateOrganization, deleteOrganization } from 'app/services/organizations';
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { ApplicationState } from "app/store";
import { setCurrentOrganization } from 'app/store/organizations/actions';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import OrganizationForm from 'app/components/Organization/OrganizationForm';
import { Typography, Button, Popconfirm } from 'antd';

interface EditDocPageParams {
}


interface DispatchProps {
    setOrganizationToState(organization: Organization | null): void;
}

interface Props extends RouteComponentProps<EditDocPageParams>, DispatchProps {
    organization?: Organization;
}


class EditOrganizationPage extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        this.state = {
            form: {}
        }
    }

    async onSubmit(data: any) {

        const organization: Organization = await updateOrganization(this.props.organization!.login, data);

        if (this.props.organization!.login !== data.login) {
            this.props.setOrganizationToState(organization);
            this.props.history.replace(`/organizations/${data.login}/settings`);
        }
        else {
            this.props.setOrganizationToState(organization);
        }
        alert(`Orgnization ${data.displayName} update successfully`);

    }


    async onDelete() {
        await deleteOrganization(this.props.organization!.login);
        this.props.history.replace(`/organizations`)
    }

    render() {
        if (this.props.organization) {
            return (
                <div className="wrap-content">
                    <Typography.Title level={2}>Edit {this.props.organization.displayName}</Typography.Title>
                    <OrganizationForm submitButtonText="Update" initData={this.props.organization} onSumbit={this.onSubmit.bind(this)}></OrganizationForm>
                    <Typography.Title level={2}>Danger Zone</Typography.Title>
                    <Popconfirm onConfirm={this.onDelete.bind(this)} title="Are you sure?">
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </div>
            );
        }
        else {
            return (<AhoraSpinner />);
        }
    };
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        organization: state.organizations.currentOrganization,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        setOrganizationToState: (organization: Organization) => {
            dispatch(setCurrentOrganization(organization));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditOrganizationPage as any);
