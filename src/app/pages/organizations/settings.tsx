import * as React from "react";
import { RouteComponentProps, Switch, Route } from "react-router";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import StatusesPage from "app/pages/statusesPage";
import { Organization, getOrganizations } from "app/services/organizations";
import LabelsPage from "app/pages/labels";
import PeoplePage from "app/pages/people";

interface SettingsPageState {
  organization: Organization | null;
}

interface SettingsPageParams {
  login: string;
  section: string;
  settingsSection: string;
}

interface Props extends RouteComponentProps<SettingsPageParams> { }

export default class OrganizationSettingsPage extends React.Component<
  Props,
  SettingsPageState
  > {
  constructor(props: Props) {
    super(props);
    this.state = {
      organization: null
    };
  }

  async componentDidMount() {
    const organizations: Organization[] = await getOrganizations();
    const organization: Organization = organizations.filter(
      x => x.login === this.props.match.params.login
    )[0];
    this.setState({
      organization
    });
  }
  render = () => {
    const organization = this.state.organization;
    if (organization) {
      return (
        <div>
          <Nav className="mb-3" variant="tabs" defaultActiveKey={this.props.match.params.settingsSection || "home"}>
            <Nav.Item>
              <Link className="nav-link" to={`/organizations/${organization.login}/settings`}>Home</Link>
            </Nav.Item>
            <Nav.Item>
              <Link className="nav-link" to={`/organizations/${organization.login}/settings/statuses`}>Statuses
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link className="nav-link" to={`/organizations/${organization.login}/settings/labels`}>Labels</Link>
            </Nav.Item>
            <Nav.Item>
              <Link className="nav-link" to={`/organizations/${organization.login}/settings/people`}>People</Link>
            </Nav.Item>
          </Nav>
          <Switch>
            <Route path={`/organizations/:login/settings/statuses`} component={StatusesPage} />
            <Route path={`/organizations/:login/settings/labels`} component={LabelsPage} />
            <Route path={`/organizations/:login/settings/people`} component={PeoplePage} />
          </Switch>
        </div>
      );
    } else {
      return <div>Loading....</div>;
    }
  };
}
