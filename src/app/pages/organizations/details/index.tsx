import * as React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router';
import { Organization, getOrganizations } from 'app/services/organizations';
import { BrowserRouter } from 'react-router-dom';
import VideosPage from 'app/pages/projects/videos';
import VideosDetailsPage from 'app/pages/projects/videos/details';
import Nav from "react-bootstrap/Nav";

interface VideosDetailsPageState {
    organization: Organization | null;
}

interface OrganizationPageParams {
    login: string;
    section: string
}


interface Props extends RouteComponentProps<OrganizationPageParams> {

}


export default class OrganizationDetailsPage extends React.Component<Props, VideosDetailsPageState> {

    constructor(props: Props) {
        super(props);
        this.state = {
            organization: null
        };
    }

    async componentDidMount() {
        const organizations: Organization[] = await getOrganizations();
        const organization: Organization = organizations.filter(x => x.login.toLowerCase() === this.props.match.params.login.toLowerCase())[0];
        this.setState({
            organization
        });
    }
    render = () => {
        const organization = this.state.organization;
        if (organization) {
            return (
                <div>
                    <h2>{organization.login}</h2>
                    <p>{organization.description}</p>
                    <Nav className="mb-3" variant="tabs" defaultActiveKey={this.props.match.params.section || "home"}>
                        <Nav.Item>
                            <Nav.Link eventKey="home" href={`/organizations/${organization.login}`}>Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="videos" href={`/organizations/${organization.login}/videos`}>Videos</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="postmortems" href={`/organizations/${organization.login}/postmortems`}>Postmortems</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="milestones" href={`/organizations/${organization.login}/milestones`}>Milestones</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <BrowserRouter>
                        <Switch>
                            <Route path="/organizations/:login/videos/:id" render={(props) => <VideosDetailsPage {...props} />} />
                            <Route path={`/organizations/:login/videos`} component={VideosPage} />
                        </Switch>
                    </BrowserRouter>
                </div>
            );
        }
        else {
            return (<div>Loading....</div>)
        }
    };
}
