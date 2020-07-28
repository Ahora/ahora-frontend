import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { addDashboard, DashboardType } from 'app/services/dashboard';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Typography } from 'antd';
import AhoraForm from 'app/components/Forms/AhoraForm/AhoraForm';
import { AhoraFormField } from 'app/components/Forms/AhoraForm/data';

interface AddDashboardsPageState {
    fields: AhoraFormField[];
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
        this.state = {
            fields: [
                {
                    displayName: "Title",
                    fieldName: "title",
                    required: true,
                    fieldType: "text"
                },
                {
                    displayName: "Description",
                    fieldName: "description",
                    fieldType: "text"
                },
                {
                    displayName: "Type",
                    fieldName: "Type",
                    fieldType: "enum",
                    settings: {
                        enum: DashboardType,
                        keys: [
                            "Public",
                            "Private"
                        ]
                    }
                }
            ]
        }
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
                <AhoraForm data={{}} fields={this.state.fields} onSumbit={this.onSubmit.bind(this)}></AhoraForm>
            </div>
        );
    };
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        organization: state.organizations.currentOrganization
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDashboardPage as any);