import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { addDashboard, DashboardType } from 'app/services/dashboard';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { Typography } from 'antd';
import AhoraForm from 'app/components/Forms/AhoraForm/AhoraForm';
import AhoraField from 'app/components/Forms/AhoraForm/AhoraField';

interface AddDashboardsPageState {
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
    }

    componentDidMount() {
    }


    async onSubmit(data: any) {
        const addedDashboard = await addDashboard(data);
        this.props.history.replace(`/organizations/${this.props.match.params.login}/dashboards/${addedDashboard.id}`)
    }

    render() {
        return (
            <div className="main-content">
                <Typography.Title>Add Dashboard</Typography.Title>
                <AhoraForm onSumbit={this.onSubmit.bind(this)}>
                    <AhoraField required={true} fieldName="title" displayName="Title" fieldType="text"></AhoraField>
                    <AhoraField fieldName="description" displayName="Description" fieldType="text"></AhoraField>
                    <AhoraField fieldName="dashboardType" displayName="Type" fieldType="enum" settings={{ enum: DashboardType, keys: ["Public", "Private"] }}></AhoraField>
                </AhoraForm>
            </div>
        );
    };
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        organization: state.organizations.currentOrganization
    };
};

export default connect(mapStateToProps)(AddDashboardPage as any);