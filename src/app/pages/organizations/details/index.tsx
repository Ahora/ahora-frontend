import * as React from "react";
import { RouteComponentProps, Switch, Route } from "react-router";
import { Organization, getOrganizationByLogin, OrganizationDetailsWithPermission } from "../../../services/organizations";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import DocsPage from "app/pages/docs";
import DocsDetailsPage from "app/pages/docs/details";
import DashboardDetailsPage from "app/pages/dashboards/details";
import AddDocPage from "app/pages/docs/add";
import AddDashboardPage from "app/pages/dashboards/add";
import OrganizationSettingsPage from "../settings";
import { Dispatch } from "redux";
import { setCurrentOrganization, setSearchCriteria } from "app/store/organizations/actions";
import { connect } from "react-redux";
import { ApplicationState } from "app/store";
import { Link } from "react-router-dom";
import { DocType } from "app/services/docTypes";
import { requestDocTypesData } from "app/store/docTypes/actions";
import OrganizationTeamRootPage from "app/pages/teams/root";
import DashboardsPage from "app/pages/dashboards";
import { User } from "app/services/users";
import { requestCurrentUserData } from "app/store/currentuser/actions";
import AhoraSpinner from "app/components/Forms/Basics/Spinner";
import { OrganizationTeamUser } from "app/services/organizationTeams";
import { canManageOrganization, canManageNotifications } from "app/services/authentication";
import NotificationsPage from "app/pages/notifications";
import MilestonesPage from "app/pages/milestones";
import { requestMilestonesData } from "app/store/milestones/actions";
import { requestLabelsData } from "app/store/labels/actions";
import { requestStatusesData } from "app/store/statuses/actions";
import OrganizationNew from "./new";
import { SearchCriterias } from "app/components/SearchDocsInput";

interface OrganizationDetailsPageProps {
  docTypes?: DocType[];
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
  setSearchCriterias(data?: SearchCriterias): void;
  requestDocTypes(): void;
  requestLabels(): void;
  requestStatuses(): void;
  requestMilestones(): void;
  requestCurrentUser(): void;
}

interface Props extends RouteComponentProps<OrganizationPageParams>, DispatchProps, OrganizationDetailsPageProps {

}

class OrganizationDetailsPage extends React.Component<Props, OrganizationDetailsPageState> {
  constructor(props: Props) {
    super(props);

    this.state = { organization: null };
  }

  async componentDidMount() {
    const organization: OrganizationDetailsWithPermission | null = await getOrganizationByLogin(this.props.match.params.login);
    if (organization) {
      this.props.setOrganizationToState(organization, organization.permission);
      this.props.setSearchCriterias({ status: ["open"] });
      this.setState({ organization });
    }
    this.props.requestDocTypes();
    this.props.requestMilestones();
    this.props.requestLabels();
    this.props.requestStatuses();
    this.props.requestCurrentUser();
  }
  render = () => {
    const organization = this.state.organization;
    if (organization) {
      const canManageOrg: boolean = canManageOrganization(this.props.currentOrgPermission);
      let canManageNotificationsBool: boolean = canManageNotifications(this.props.currentUser);
      canManageNotificationsBool = false; //Notifications are not ready, yet
      return (
        <Container fluid={true}>
          <h2>{organization.displayName}</h2>
          <p>{organization.description}</p>
          <Nav className="mb-3" variant="tabs" defaultActiveKey={this.props.match.params.section || "browse"}>
            <Nav.Item>
              <Link className="nav-link" to={`/organizations/${organization.login}/dashboards`}>Dashboards</Link>
            </Nav.Item>
            <Nav.Item>
              <Link className="nav-link" to={`/organizations/${organization.login}/docs`}>Browse</Link>
            </Nav.Item>
            <Nav.Item>
              <Link className="nav-link" to={`/organizations/${organization.login}/teams`}>Teams</Link>
            </Nav.Item>
            <Nav.Item>
              <Link className="nav-link" to={`/organizations/${organization.login}/milestones`}>Milestones</Link>
            </Nav.Item>
            {
              canManageNotificationsBool &&
              <Nav.Item>
                <Link className="nav-link" to={`/organizations/${organization.login}/notifications`}>Notifications</Link>
              </Nav.Item>
            }
            {
              canManageOrg &&
              <>
                <Nav.Item>
                  <Link className="nav-link" to={`/organizations/${organization.login}/settings`}>Settings</Link>
                </Nav.Item>
              </>
            }
          </Nav>
          <Switch>
            <Route path={`/organizations/:login/settings/:settingsSection?`} component={OrganizationSettingsPage} />
            <Route path={`/organizations/:login/docs/add`} component={AddDocPage} />
            <Route path={`/organizations/:login/new`} component={OrganizationNew} />
            <Route path={`/organizations/:login/docs/:id`} component={DocsDetailsPage} />
            <Route path={`/organizations/:login/docs`} component={DocsPage} />
            <Route path={`/organizations/:login/dashboards/add`} component={AddDashboardPage} />
            <Route path={`/organizations/:login/dashboards/:id`} component={DashboardDetailsPage} />
            <Route path={`/organizations/:login/dashboards`} component={DashboardsPage} />
            <Route path={`/organizations/:login/notifications`} component={NotificationsPage} />
            <Route path={`/organizations/:login/milestones`} component={MilestonesPage} />
            <Route path={`/organizations/:login/teams`} component={OrganizationTeamRootPage} />
            <Route path={`/organizations/:login`} component={DashboardsPage}>
            </Route>
          </Switch>
        </Container>
      );
    } else {
      return <AhoraSpinner></AhoraSpinner>;
    }
  };
}

const mapStateToProps = (state: ApplicationState) => {
  return {
    currentOrgPermission: state.organizations.currentOrgPermission,
    docTypes: state.docTypes.docTypes,
    currentUser: state.currentUser.user
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    requestDocTypes: () => dispatch(requestDocTypesData()),
    requestMilestones: () => dispatch(requestMilestonesData()),
    requestStatuses: () => dispatch(requestStatusesData()),
    requestLabels: () => dispatch(requestLabelsData()),
    setSearchCriterias: (data: SearchCriterias) => dispatch(setSearchCriteria(data)),
    setOrganizationToState: (organization: Organization, permission?: OrganizationTeamUser) => dispatch(setCurrentOrganization(organization, permission)),
    requestCurrentUser: () => dispatch(requestCurrentUserData())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationDetailsPage as any);
