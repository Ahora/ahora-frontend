import * as React from 'react';
import { deleteOrganizationTeamMethod, OrganizationTeam, getTeamById, addOrganizationTeam, getTeams } from 'app/services/organizationTeams';
import { RouteComponentProps } from 'react-router';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

interface TeamsPageState {
    team: OrganizationTeam | null;
    subTeams: OrganizationTeam[] | null;
    teamNameVal?: string;
}

interface TeamPageParams {
    id?: string;
    login: string;
}

interface TeamPageProps extends RouteComponentProps<TeamPageParams> {

}

interface AllProps extends TeamPageProps {

}

export default class OrganizationTeamDetailsPage extends React.Component<AllProps, TeamsPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            team: null,
            subTeams: null
        };
    }

    componentDidUpdate(prevProps: AllProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.componentDidMount();
        }
    }
    async componentDidMount() {
        const currentTeamId: number | null = this.props.match.params.id ? parseInt(this.props.match.params.id) : null;
        if (currentTeamId) {
            const team = await getTeamById(currentTeamId);
            this.setState({ team });
        }
        else {
            this.setState({ team: null })
        }

        const subTeams = await getTeams(currentTeamId);
        this.setState({ subTeams });
    }

    teamNameChanged(event: any) {
        this.setState({ teamNameVal: event.target.value });
    }

    async submitForm(event: any) {
        if (event) {
            event!.preventDefault();
        }
        if (this.state.teamNameVal && this.state.teamNameVal.trim().length > 0) {
            const addedTeam = await addOrganizationTeam(this.state.teamNameVal.trim(), this.state.team && this.state.team.id);
            this.setState({
                subTeams: [addedTeam, ...this.state.subTeams],
                teamNameVal: ""
            });
        }
    }


    async deleteTeam() {
        if (this.state.team) {
            await deleteOrganizationTeamMethod(this.state.team);
            this.props.history.replace(`/organizations/${this.props.match.params.login}/teams/${this.state.team.parentId}`)
        }
    }

    render() {
        return (
            <div>

                <div>
                    {this.state.team &&
                        <>
                            <h2>Team: {this.state.team && this.state.team.name}</h2>
                            <h2>Sub Teams</h2>
                        </>
                    }
                    <div>
                        <Form onSubmit={this.submitForm.bind(this)}>
                            <Form.Group>
                                <Form.Label>Add Team</Form.Label>
                                <InputGroup>
                                    <Form.Control value={this.state.teamNameVal} onChange={this.teamNameChanged.bind(this)} placeholder="Enter team name" />
                                    <InputGroup.Append>
                                        <Button type="submit" variant="primary">Add</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </div>
                    {this.state.subTeams &&
                        <Table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(this.state.subTeams.map((team) => {
                                    return (
                                        <tr className="pt-3" key={team.id}>
                                            <td><Link to={`/organizations/${this.props.match.params.login}/teams/${team.id}`}>{team.name}</Link></td>
                                        </tr>);
                                }))}
                            </tbody>
                        </Table>
                    }
                    <h2>Members</h2>

                    <h2>Danger Zone</h2>
                    {this.state.team &&
                        <Button type="button" onClick={this.deleteTeam.bind(this)} variant="danger">Delete Team</Button>
                    }
                </div>
            </div>
        );
    };
}