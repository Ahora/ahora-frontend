import * as React from "react";
import { RouteComponentProps, Switch, Route } from "react-router";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import StatusesPage from "app/pages/statusesPage";
import { Organization, getOrganizationByLogin } from "app/services/organizations";
import docTypesPage from "app/pages/docTypes";
import LabelsPage from "app/pages/labels";
import DocSourcesPage from "app/pages/docSources";
import EditOrganizationPage from "app/pages/organizations/edit";

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
    const organization: Organization | null = await getOrganizationByLogin(this.props.match.params.login);
    this.setState({ organization });
  }
  render = () => {
    const organization = this.state.organization;
    if (organization) {
      return (
        <div>
          <Nav className="mb-3" variant="tabs">
            <Nav.Item>
              <Link className={(!this.props.match.params.settingsSection) ? "nav-link active" : "nav-link"} to={`/organizations/${organization.login}/settings`}>Home</Link>
            </Nav.Item>
            <Nav.Item>
              <Link className={(this.props.match.params.settingsSection === "statuses") ? "nav-link active" : "nav-link"} to={`/organizations/${organization.login}/settings/statuses`}>Statuses</Link>
            </Nav.Item>
            <Nav.Item>
              <Link className={(this.props.match.params.settingsSection === "doctypes") ? "nav-link active" : "nav-link"} to={`/organizations/${organization.login}/settings/doctypes`}>Doc Types</Link>
            </Nav.Item>
            <Nav.Item >
              <Link className={(this.props.match.params.settingsSection === "labels") ? "nav-link active" : "nav-link"} to={`/organizations/${organization.login}/settings/labels`}>Labels</Link>
            </Nav.Item>
            <Nav.Item>
              <Link className={(this.props.match.params.settingsSection === "docsoures") ? "nav-link active" : "nav-link"} to={`/organizations/${organization.login}/settings/docsources`}>Doc Sources</Link>
            </Nav.Item>
          </Nav>
          <Switch>
            <Route path={`/organizations/:login/settings/statuses`} component={StatusesPage} />
            <Route path={`/organizations/:login/settings/doctypes`} component={docTypesPage} />
            <Route path={`/organizations/:login/settings/labels`} component={LabelsPage} />
            <Route path={`/organizations/:login/settings/docsources`} component={DocSourcesPage} />
            <Route exactpath={`/organizations/:login/settings`} component={EditOrganizationPage} />
          </Switch>
        </div>
      );
    } else {
      return <div>Loading....</div>;
    }
  };
}
