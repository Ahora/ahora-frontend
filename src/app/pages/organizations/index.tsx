import * as React from 'react';
import { getOrganizations, Organization } from 'app/services/organizations';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

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
                <Container>
                    <h1>Organizations</h1>
                    <Nav className="mb-3">
                        <Nav.Item>
                            <Button variant="primary" type="button" href={`/organizations/add`}>Add</Button>
                        </Nav.Item>
                    </Nav>
                    <ListGroup>
                        {this.state.organizations.map((org) => {
                            return <ListGroup.Item key={org.id}>
                                <Link to={`/organizations/${org.login}`}>{org.displayName}</Link>
                            </ListGroup.Item>
                        })}
                    </ListGroup>
                </Container>
            );
        }
        else {
            return (<div>Loading....</div>)
        }

    };
}
