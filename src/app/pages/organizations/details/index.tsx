import * as React from "react";
import { RouteComponentProps, Switch, Route, Redirect } from "react-router";
import { Organization, getOrganizationByLogin } from "../../../services/organizations";
import DocsPage from "app/pages/docs";
import DashboardDetailsPage from "app/pages/dashboards/details";
import AddDashboardPage from "app/pages/dashboards/add";
import OrganizationSettingsPage from "../settings";
import { Dispatch } from "redux";
import { setCurrentOrganization } from "app/store/organizations/actions";
import { connect } from "react-redux";
import { ApplicationState } from "app/store";
import { requestDocTypesData } from "app/store/docTypes/actions";
import OrganizationTeamRootPage from "app/pages/teams/root";
import DashboardsPage from "app/pages/dashboards";
import AddShortcutPage from "app/pages/shortcuts/add";
import { User } from "app/services/users";
import { requestCurrentUserData } from "app/store/currentuser/actions";
import AhoraSpinner from "app/components/Forms/Basics/Spinner";
import { OrganizationTeamUser } from "app/services/organizationTeams";
import NotificationsPage from "app/pages/notifications";
import MilestonesPage from "app/pages/milestones";
import ShortcutsPage from "app/pages/shortcuts";
import { requestMilestonesData } from "app/store/milestones/actions";
import { requestStatusesData } from "app/store/statuses/actions";
import OrganizationNew from "./new";
import { requestShortcutsData } from "app/store/shortcuts/actions";
import { OrganizationShortcut } from "app/services/OrganizationShortcut";
import OrganizationMenu from "./OrganizationMenu"
import { Layout } from "antd";
import OrganizationWebSocket from "app/websockets/organizationWS";

interface OrganizationDetailsPageProps {
  shortcuts?: OrganizationShortcut[];
  currentOrgPermission?: OrganizationTeamUser;
  currentUser?: User | undefined;
}

interface OrganizationDetailsPageState {
  organization: Organization | null;
}

interface OrganizationPageParams {
  login: string;
  section: string;
}

interface DispatchProps {
  setOrganizationToState(organization: Organization | null, permission?: OrganizationTeamUser): void;
  requestDocTypes(): void;
  requestShortcuts(): void;
  requestStatuses(): void;
  requestMilestones(): void;
  requestCurrentUser(): void;
}

interface Props extends RouteComponentProps<OrganizationPageParams>, DispatchProps, OrganizationDetailsPageProps {

}

class OrganizationDetailsPage extends React.Component<Props, OrganizationDetailsPageState> {

  private currentOrgSocket: OrganizationWebSocket | undefined;
  constructor(props: Props) {
    super(props);

    this.state = { organization: null };
  }

  async componentDidMount() {
    const organization = await getOrganizationByLogin(this.props.match.params.login);

    this.currentOrgSocket = new OrganizationWebSocket(this.props.match.params.login);

    if (organization) {
      this.props.setOrganizationToState(organization, organization.permission);
      this.setState({ organization });
    }

    this.props.requestDocTypes();
    this.props.requestMilestones();

    if (this.props.currentUser) {
      this.props.requestShortcuts();
    }
    this.props.requestStatuses();
    this.props.requestCurrentUser();
  }

  componentWillUnmount() {
    if (this.currentOrgSocket) {
      this.currentOrgSocket.close();
    }
  }

  render = () => {
    const { Content } = Layout;
    const organization = this.state.organization;
    if (organization) {
      return (
        <Layout>
          <OrganizationMenu match={this.props.match.params.section} organization={organization} currentUser={this.props.currentUser} currentOrgPermission={this.props.currentOrgPermission} shortcuts={this.props.shortcuts} />
          <Layout className="site-layout-content">
            <Content>
              <Switch>
                <Route path={`/organizations/:login/settings/:settingsSection?`} component={OrganizationSettingsPage} />
                <Route path={`/organizations/:login/onboarding`} component={OrganizationNew} />
                <Route path={`/organizations/:login/dashboards/add`} component={AddDashboardPage} />
                <Route path={`/organizations/:login/dashboards/:id`} component={DashboardDetailsPage} />
                <Route path={`/organizations/:login/dashboards`} component={DashboardsPage} />
                <Route path={`/organizations/:login/notifications`} component={NotificationsPage} />
                <Route path={`/organizations/:login/shortcuts/add`} component={AddShortcutPage} />
                <Route path={`/organizations/:login/shortcuts`} component={ShortcutsPage} />
                <Route path={`/organizations/:login/milestones`} component={MilestonesPage} />
                <Route path={`/organizations/:login/teams`} component={OrganizationTeamRootPage} />
                {this.props.currentUser ?
                  <Route path={`/organizations/:login/:section/:docId?`} component={DocsPage} />
                  :
                  <>
                    <Route path={`/organizations/:login/:section(docs)/:docId?`} component={DocsPage} />
                    <Route path={`/organizations/:login/:section(inbox)/:docId?`} >
                      <Redirect to={`/organizations/${this.props.match.params.login}/docs`} />
                    </Route>
                  </>
                }
                <Route path={`/organizations/:login`} component={DashboardsPage}>
                </Route>
              </Switch>
            </Content>
          </Layout>
        </Layout>


      );
    } else {
      return <AhoraSpinner></AhoraSpinner>;
    }
  };
}

const mapStateToProps = (state: ApplicationState): OrganizationDetailsPageProps => {
  return {
    currentOrgPermission: state.organizations.currentOrgPermission,
    shortcuts: state.shortcuts.shortcuts,
    currentUser: state.currentUser.user
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    requestDocTypes: () => dispatch(requestDocTypesData()),
    requestMilestones: () => dispatch(requestMilestonesData()),
    requestStatuses: () => dispatch(requestStatusesData()),
    requestShortcuts: () => dispatch(requestShortcutsData()),
    setOrganizationToState: (organization: Organization, permission?: OrganizationTeamUser) => dispatch(setCurrentOrganization(organization, permission)),
    requestCurrentUser: () => dispatch(requestCurrentUserData())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationDetailsPage as any);
