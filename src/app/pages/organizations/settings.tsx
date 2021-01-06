import * as React from "react";
import { RouteComponentProps, Switch, Route } from "react-router";
import { Link } from "react-router-dom";
import StatusesPage from "app/pages/statusesPage";
import { Organization, getOrganizationByLogin } from "app/services/organizations";
import docTypesPage from "app/pages/docTypes";
import LabelsPage from "app/pages/labels";
import DocSourcesPage from "app/pages/docSources";
import EditOrganizationPage from "app/pages/organizations/edit";
import PaymentPage from "app/pages/organizations/details/payment";
import { Menu } from "antd";
import AhoraSpinner from "app/components/Forms/Basics/Spinner";

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
          <Menu mode="horizontal" inlineIndent={12} activeKey={this.props.match.params.settingsSection || "home"}>
            <Menu.Item key={"home"}>
              <Link to={`/organizations/${organization.login}/settings`}>Home</Link>
            </Menu.Item>
            <Menu.Item key="statuses">
              <Link to={`/organizations/${organization.login}/settings/statuses`}>Statuses</Link>
            </Menu.Item>
            <Menu.Item key="doctypes">
              <Link to={`/organizations/${organization.login}/settings/doctypes`}>Doc Types</Link>
            </Menu.Item>
            <Menu.Item key="docsources">
              <Link to={`/organizations/${organization.login}/settings/docsources`}>Doc Sources</Link>
            </Menu.Item>
          </Menu>
          <div className="main-content">
            <Switch>
              <Route path={`/organizations/:login/settings/statuses`} component={StatusesPage} />
              <Route path={`/organizations/:login/settings/doctypes`} component={docTypesPage} />
              <Route path={`/organizations/:login/settings/labels`} component={LabelsPage} />
              <Route path={`/organizations/:login/settings/docsources`} component={DocSourcesPage} />
              <Route path={`/organizations/:login/settings/payment`} component={PaymentPage} />
              <Route exactpath={`/organizations/:login/settings`} component={EditOrganizationPage} />
            </Switch>
          </div>

        </div>
      );
    } else {
      return <AhoraSpinner />;
    }
  };
}
