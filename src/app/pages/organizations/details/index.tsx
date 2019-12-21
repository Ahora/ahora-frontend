import * as React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router';
import { Organization, getOrganizationByLogin } from '../../../services/organizations';
import { BrowserRouter } from 'react-router-dom';
import Nav from "react-bootstrap/Nav";
import StatusesPage from 'app/pages/statusesPage';
import DocsPage from 'app/pages/docs';
import DocsDetailsPage from 'app/pages/docs/details';
import AddDocPage from 'app/pages/docs/add';
import EditDocPage from 'app/pages/docs/edit';
import OrganizationSettingsPage from '../settings';
import { Dispatch } from 'redux';
import { setCurrentOrganization } from 'app/store/organizations/actions';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';

interface OrganizationDetailsPageProps {
    organization: Organization | null;
}

interface OrganizationPageParams {
    login: string;
    section: string
}


interface DispatchProps {
    setOrganizationToState(organization: Organization | null): void;
}


interface Props extends RouteComponentProps<OrganizationPageParams>, DispatchProps, OrganizationDetailsPageProps {

}


class OrganizationDetailsPage extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    async componentDidMount() {
        const organization: Organization | null = await getOrganizationByLogin(this.props.match.params.login);
        this.props.setOrganizationToState(organization);
    }
    render = () => {
        const organization = this.props.organization;
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
                            <Nav.Link eventKey="discussions" href={`/organizations/${organization.login}/discussions`}>Discussions</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="labels" href={`/organizations/${organization.login}/labels`}>Labels</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="settings" href={`/organizations/${organization.login}/settings`}>Settings</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <BrowserRouter>
                        <Switch>
                            <Route path={`/organizations/:login/settings/:settingsSection?`} component={OrganizationSettingsPage} />
                            <Route path={`/organizations/:login/statuses`} component={StatusesPage} />
                            <Route path={`/organizations/:login/:docType/add`} component={AddDocPage} />
                            <Route path={`/organizations/:login/:docType/:id/edit`} component={EditDocPage} />
                            <Route path={`/organizations/:login/:docType/:id`} component={DocsDetailsPage} />
                            <Route path={`/organizations/:login/:docType`} component={DocsPage} />
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

const mapStateToProps = (state: ApplicationState) => {
    return {
        organization: state.organizations.currentOrganization
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        setOrganizationToState: (organization: Organization) => { dispatch(setCurrentOrganization(organization)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationDetailsPage as any); 