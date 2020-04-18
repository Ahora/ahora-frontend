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
import { OrganizationTeam, getAllTeams } from "app/services/organizationTeams";
import LabelsGraph from "app/components/Charts/LabelsGraph";
const Graph = require("react-graph-vis");

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

interface DispatchProps {
  requestDocTypes(): void;
}

interface Props extends RouteComponentProps<OrganizationPageParams>, DispatchProps, OrganizationDashboardPageProps {

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

    const edges: any[] = this.state.teams.map((team) => {
      return { from: team.id, to: team.parentId || -1 };
    });

    const graph = { nodes, edges };

    const options: any = {
      layout: {
        hierarchical: true
      },
      edges: {
        color: "#000000"
      },
      height: "500px"
    };

    const events: any = {
      select: function (event: any) {
        console.log(event);
      }
    };
    if (organization) {
      return (
        <div>
          <div style={{ display: "none" }}>
            <Graph.default graph={graph} options={options} events={events} style={{ height: "640px" }} />
          </div>
          <LabelsGraph history={this.props.history} searchCriterias={{ status: ["opened", "closed"] }} labelStartWith="area/"></LabelsGraph>
          <LabelsGraph history={this.props.history} searchCriterias={{ status: ["opened", "closed"] }} labelStartWith="sig/"></LabelsGraph>
          <h2 style={{ display: "none" }}>Assigned to me</h2>
          <DocList style={{ display: "none" }} searchCriteria={{ assignee: ["me"], status: ["opened"] }}>
            <p>No Assigned Tasks</p>
            <Link to={`/organizations/${organization.login}/docs/add`}>
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
