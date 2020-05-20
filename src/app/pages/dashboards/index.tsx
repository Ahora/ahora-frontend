import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Dashboard, getDashboards, DashboardType } from 'app/services/dashboard';
import Table from 'react-bootstrap/Table';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';


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
            <div>
                <Nav className="mb-3">
                    <Nav.Item>
                        <Link to={`/organizations/${this.props.match.params.login}/dashboards/add`}>
                            <Button variant="primary" type="button">Add</Button>
                        </Link>
                    </Nav.Item>
                </Nav>

                {this.state.dashboards ?
                    <Table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>User</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.dashboards && (this.state.dashboards.map((dashboard: Dashboard) => {
                                return (
                                    <tr className="pt-3" key={dashboard.id}>
                                        <td>
                                            <Link to={`/organizations/${this.props.match.params.login}/dashboards/${dashboard.id}`}>
                                                {dashboard.title}
                                            </Link>
                                        </td>
                                        <td>{dashboard.description}</td>
                                        <td>{dashboard.dashboardType === DashboardType.Public ? "Public" : "Private"}</td>
                                        <td>{dashboard.user.displayName}</td>
                                    </tr>);
                            }))}
                        </tbody>
                    </Table>
                    :
                    <AhoraSpinner />
                }
            </div>
        );
    };
}

export default DashboardsPage; 