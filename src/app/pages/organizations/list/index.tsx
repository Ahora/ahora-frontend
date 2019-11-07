import * as React from 'react';
import { getOrganizations, Organization } from 'app/services/organizations';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';

interface OrganizationsPageState {
    organizations: Organization[];
}

export default class OrganizationsPage extends React.Component<any, OrganizationsPageState> {

    constructor(props: any) {
        super(props);
        this.state = {
            organizations: []
        };
    }

    async componentDidMount() {
        const organizations: Organization[] = await getOrganizations();
        this.setState({
            organizations
        });
    }
    render = () => {
        if (this.state.organizations) {
            return (
                <div>
                    <h1>Organizations</h1>
                    <ListGroup>
                        {this.state.organizations.map((org) => {
                            return <ListGroup.Item key={org.node_id}>
                                <Link to={`organizations/${org.login}`}>{org.login}</Link>
                            </ListGroup.Item>
                        })}
                    </ListGroup>
                </div>
            );
        }
        else {
            return (<div>Loading....</div>)
        }

    };
}
