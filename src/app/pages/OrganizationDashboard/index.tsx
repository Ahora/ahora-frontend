import * as React from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { ApplicationState } from "app/store";
import { DocType } from "app/services/docTypes";
import { Organization } from "app/services/organizations";
import DocList from "app/components/DocList";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { OrganizationTeam, getAllTeams } from "app/services/organizationTeams";

interface OrganizationDashboardPageProps {
  organization: Organization | null;
  docTypes?: DocType[];
}

interface OrganizationDashboardState {
  teams: OrganizationTeam[]
}

interface OrganizationPageParams {
  login: string;
  section: string;
}

interface Props extends RouteComponentProps<OrganizationPageParams>, OrganizationDashboardPageProps {

}

class OrganizationDashboardPage extends React.Component<Props, OrganizationDashboardState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      teams: []
    }
  }



  async componentDidMount() {
    const teams: OrganizationTeam[] = await getAllTeams();
    this.setState({
      teams
    });
  }

  render = () => {
    const organization = this.props.organization;

    const nodes: any[] = this.state.teams.map((team) => {
      return { id: team.id, label: team.name, title: team.name }
    });

    if (organization) {
      nodes.push({ id: -1, label: organization.displayName })

    }

    if (organization) {
      return (
        <div>
          <h2 style={{ display: "none" }}>Assigned to me</h2>
          <DocList style={{ display: "none" }} searchCriteria={{ assignee: ["me"], status: ["opened"] }}>
            <p>No Assigned Tasks</p>
            <Link to={`/organizations/${organization.login}/docs/add`}>
              <Button variant="primary" type="button">Add Doc</Button>
            </Link>
          </DocList>
        </div >
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


export default connect(
  mapStateToProps,
  null
)(OrganizationDashboardPage as any);
