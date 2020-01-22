import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { deleteOrganizationTeamMethod, getTeamsByOrganization, OrganizationTeam, addOrganizationTeam } from 'app/services/organizationTeams';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

interface TeamsPageState {
    teams: OrganizationTeam[] | null;
    teamNameVal: string;
}

interface StatusPageProps {
}

interface AllProps extends StatusPageProps {

}

export default class OrganizationTeamPage extends React.Component<AllProps, TeamsPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            teams: null,
            teamNameVal: ""
        };
    }

    async componentDidMount() {
        const teams = await getTeamsByOrganization();
        this.setState({ teams });
    }

    teamNameChanged(event: any) {
        this.setState({ teamNameVal: event.target.value });
    }

    async submitForm(event: any) {
        if (event) {
            event!.preventDefault();
        }
        if (this.state.teamNameVal && this.state.teamNameVal.trim().length > 0) {
            const addedTeam = await addOrganizationTeam(this.state.teamNameVal.trim());
            this.setState({
                teams: [addedTeam, ...this.state.teams],
                teamNameVal: ""
            });
        }
    }

    async deleteTeam(team: OrganizationTeam) {
        await deleteOrganizationTeamMethod(team);

        if (this.state.teams) {
            //Keep all the other usets in state!
            this.setState({
                teams: this.state.teams.filter(t => t.id !== team.id)
            });
        }
    }

    render() {
        return (
            <div>
                <h2>Teams</h2>
                <div>
                    <Form onSubmit={this.submitForm.bind(this)}>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <InputGroup>
                                <Form.Control value={this.state.teamNameVal} onChange={this.teamNameChanged.bind(this)} placeholder="Enter team name" />
                                <InputGroup.Append>
                                    <Button type="submit" variant="primary">Add</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </div>
                {this.state.teams ?
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(this.state.teams.map((team) => {
                                return (
                                    <tr className="pt-3" key={team.id}>
                                        <td>{team.name}</td>
                                        <td>
                                            <Button variant="danger" onClick={() => { this.deleteTeam(team); }}>Delete</Button>
                                        </td>
                                    </tr>);
                            }))}
                        </tbody>
                    </Table>
                    : (<div className="text-center"><Spinner animation="border" variant="primary" /></div>)
                }
            </div>
        );
    };
}