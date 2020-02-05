import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { ApplicationState } from "app/store";
import { DocType } from "app/services/docTypes";
import { requestDocTypesData } from "app/store/docTypes/actions";
import { Organization } from "app/services/organizations";
import DocList from "app/components/DocList";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

interface OrganizationDashboardPageProps {
  organization: Organization | null;
  docTypes?: DocType[];
}

interface OrganizationPageParams {
  login: string;
  section: string;
}

interface DispatchProps {
  requestDocTypes(): void;
}

interface Props extends RouteComponentProps<OrganizationPageParams>, DispatchProps, OrganizationDashboardPageProps {

}

class OrganizationDashboardPage extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  async componentDidMount() {

  }

  render = () => {
    const organization = this.props.organization;
    if (organization) {
      return (
        <div>
          <h2>Assigned to me</h2>
          <DocList searchCriteria={{ assignee: ["me"], status: ["opened"] }}>
            <p>No Assigned Tasks</p>
            <Link to={`/organizations/${organization.login}/doctypes/add`}>
              <Button variant="primary" type="button">Add Doc</Button>
            </Link>
          </DocList>
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationDashboardPage as any);
