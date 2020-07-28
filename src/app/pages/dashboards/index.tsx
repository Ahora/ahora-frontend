import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Dashboard, getDashboards, DashboardType } from 'app/services/dashboard';
import { Link } from 'react-router-dom';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import CanAddDashboard from 'app/components/Authentication/CanAddDashboard';
import { Button, Table, Menu } from 'antd';


interface DashboardsPageState {
    dashboards?: Dashboard[];
}

interface DashboardsPageParams {
    login: string;
}

interface DashboardsPageProps extends RouteComponentProps<DashboardsPageParams> {

}


interface DispatchProps {
    requestStatusesData(): void;
    requestDashboardTypes(): void;
    setSearchCriterias(data?: string): void;
}

interface AllProps extends DashboardsPageProps, DispatchProps {

}

class DashboardsPage extends React.Component<AllProps, DashboardsPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
        }
    }

    async componentDidMount() {
        const dashboards = await getDashboards();
        this.setState({ dashboards });
    }

    render() {
        return (
            <>
                <Menu className="navbar-menu" mode="horizontal">
                    <CanAddDashboard>
                        <Link to={`/organizations/${this.props.match.params.login}/dashboards/add`}>
                            <Button type="primary">Add dashboard</Button>
                        </Link>
                    </CanAddDashboard>
                </Menu>
                <div>
                    {this.state.dashboards ?
                        <Table rowKey="id" dataSource={this.state.dashboards}>

                            <Table.Column title="Title" dataIndex="title" key="title" render={(text, dashboard: Dashboard) => (
                                <Link to={`/organizations/${this.props.match.params.login}/dashboards/${dashboard.id}`}>
                                    {text}
                                </Link>
                            )} />
                            <Table.Column title="Description" dataIndex="user!.displayName" key="user!.displayName" />
                            <Table.Column title="User" dataIndex="description" key="description" />

                            <Table.Column title="Type" dataIndex="dashboardType" key="dashboardType" render={(dashboardType: any) =>
                                <>{dashboardType === DashboardType.Public ? "Public" : "Private"}</>
                            } />
                        </Table>
                        :
                        <AhoraSpinner />
                    }
                </div>
            </>
        );

    }
}

export default DashboardsPage; 