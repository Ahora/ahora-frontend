import * as React from "react";
import { RouteComponentProps, Switch, Route } from "react-router";
import { Organization, getOrganizationByLogin } from "../../../services/organizations";
import Nav from "react-bootstrap/Nav";
import StatusesPage from "app/pages/statusesPage";
import DocsPage from "app/pages/docs";
import DocsDetailsPage from "app/pages/docs/details";
import AddDocPage from "app/pages/docs/add";
import EditDocPage from "app/pages/docs/edit";
import OrganizationSettingsPage from "../settings";
import { Dispatch } from "redux";
import { setCurrentOrganization } from "app/store/organizations/actions";
import { connect } from "react-redux";
import { ApplicationState } from "app/store";
import { Link } from "react-router-dom";
import { DocType } from "app/services/docTypes";
import { requestDocTypesData } from "app/store/docTypes/actions";

interface OrganizationDetailsPageProps {
  organization: Organization | null;
  docTypes?: DocType[];
}

interface OrganizationPageParams {
  login: string;
  section: string;
}

interface DispatchProps {
  setOrganizationToState(organization: Organization | null): void;
  requestDocTypes(): void;
}

interface Props
  extends RouteComponentProps<OrganizationPageParams>,
  DispatchProps,
  OrganizationDetailsPageProps { }

class OrganizationDetailsPage extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  async componentDidMount() {
    const organization: Organization | null = await getOrganizationByLogin(
      this.props.match.params.login
    );
    this.props.setOrganizationToState(organization);
    this.props.requestDocTypes();
  }
  render = () => {
    const organization = this.props.organization;
    if (organization) {
      return (
        <div>
          <h2>{organization.displayName}</h2>
          <p>{organization.description}</p>
          <Nav className="mb-3" variant="tabs" defaultActiveKey={this.props.match.params.section || "home"}>
            <Nav.Item>
              <Link className="nav-link" to={`/organizations/${organization.login}`}>Home</Link>
            </Nav.Item>

            {this.props.docTypes &&
              <>
                {this.props.docTypes.map((docType) => {
                  return (<Nav.Item key={docType.id}>
                    <Link className="nav-link" to={`/organizations/${organization.login}/${docType.code}`}>{docType.name}</Link>
                  </Nav.Item>);
                })}
              </>
            }
            <Nav.Item>
              <Link className="nav-link" to={`/organizations/${organization.login}/settings`}>Settings</Link>
            </Nav.Item>
          </Nav>
          <Switch>
            <Route path={`/organizations/:login/settings/:settingsSection?`} component={OrganizationSettingsPage} />
            <Route path={`/organizations/:login/statuses`} component={StatusesPage} />
            <Route path={`/organizations/:login/:docType/add`} component={AddDocPage} />
            <Route path={`/organizations/:login/:docType/:id/edit`} component={EditDocPage} />
            <Route path={`/organizations/:login/:docType/:id`} component={DocsDetailsPage} />
            <Route path={`/organizations/:login/:docType`} component={DocsPage} />
          </Switch>
        </div>
      );
    } else {
      return <div>Loading....</div>;
    }
  };
}

const mapStateToProps = (state: ApplicationState) => {
  return {
    organization: state.organizations.currentOrganization,
    docTypes: state.docTypes.docTypes
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    requestDocTypes: () => dispatch(requestDocTypesData()),
    setOrganizationToState: (organization: Organization) => dispatch(setCurrentOrganization(organization))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationDetailsPage as any);
