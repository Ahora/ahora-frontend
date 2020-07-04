import * as React from 'react';
import { deleteOrganizationTeamMethod, OrganizationTeam, getTeamById, addOrganizationTeam, getTeams, OrganizationTeamUser, getUsersByTeam, deleteUserFromTeam, updateTeamName, TeamUserType } from 'app/services/organizationTeams';
import { RouteComponentProps } from 'react-router';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import EditableHeader from 'app/components/EditableHeader';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import CanManageOrganization from 'app/components/Authentication/CanManageOrganization';
import { AddTeamMemberForm } from 'app/components/Teams/AddTeamMemberForm';

interface TeamsPageState {
    team: OrganizationTeam | null;
    subTeams: OrganizationTeam[] | null;
    users: OrganizationTeamUser[] | null
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
            subTeams: null,
            users: null
        };
    }

    componentDidUpdate(prevProps: AllProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.componentDidMount();
        }
    }

    async componentDidMount() {

        this.setState({
            team: null,
            subTeams: null,
            users: null,
            teamNameVal: undefined
        });

        const currentTeamId: number | null = this.props.match.params.id ? parseInt(this.props.match.params.id) : null;
        if (currentTeamId) {
            const team = await getTeamById(currentTeamId);
            this.setState({ team });
        }
        else {
            this.setState({ team: null })
        }

        const [subTeams, users] = await Promise.all([
            getTeams(currentTeamId),
            getUsersByTeam(currentTeamId)
        ])

        this.setState({ subTeams, users });
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

    onUserAdded(addedUser: OrganizationTeamUser) {
        this.setState({
            users: [addedUser, ...this.state.users]
        });
    }

    async deleteUser(userToDelete: OrganizationTeamUser) {
        await deleteUserFromTeam(userToDelete.id, this.state.team ? this.state.team.id : null);
        this.setState({
            users: this.state.users!.filter(user => user.id !== userToDelete.id)
        });
    }

    async onTeamNameChanged(value: string) {
        if (this.state.team) {
            await updateTeamName(value, this.state.team.id);
            this.setState({
                team: { ...this.state.team, name: value }
            })
        }
    }

    render() {
        return (
            <div>

                <div>
                    {this.state.team &&
                        <>
                            <EditableHeader canEdit={true} onChanged={this.onTeamNameChanged.bind(this)} value={this.state.team.name}><h2>Team: {this.state.team && this.state.team.name}</h2></EditableHeader>
                        </>
                    }
                    <h2>Members</h2>
                    <CanManageOrganization>
                        <AddTeamMemberForm teamId={this.state.team ? this.state.team.id : null} onUserAdded={this.onUserAdded.bind(this)} />
                    </CanManageOrganization>
                    {this.state.users ?
                        <>
                            {this.state.users.length > 0 ?
                                <Table className="mt-2">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Type</th>
                                            <CanManageOrganization>
                                                <th>Actions</th>
                                            </CanManageOrganization>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(this.state.users.map((user) => {
                                            return (
                                                <tr className="pt-3" key={user.id}>
                                                    <td>{user.User.displayName} ({user.User.username})</td>
                                                    <td>{user.permissionType === TeamUserType.Member ? "Member" : "Owner"}</td>
                                                    <CanManageOrganization>
                                                        <td>
                                                            <Button variant="danger" onClick={() => { this.deleteUser(user); }}>Delete</Button>
                                                        </td>
                                                    </CanManageOrganization>
                                                </tr>);
                                        }))}
                                    </tbody>
                                </Table> :
                                <p>No members</p>
                            }
                        </>
                        : (<AhoraSpinner />)
                    }
                    <div>
                        <h2>Sub Teams</h2>
                        <CanManageOrganization>
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
                        </CanManageOrganization>
                    </div>
                    {this.state.subTeams ?
                        <>
                            {this.state.subTeams.length > 0 ?

                                < Table >
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
                                </Table> : <p>No teams</p>
                            }
                        </>
                        : (<AhoraSpinner />)
                    }
                    <CanManageOrganization>
                        {this.state.team &&
                            <div>
                                <h2>Danger Zone</h2>
                                <Button type="button" onClick={this.deleteTeam.bind(this)} variant="danger">Delete Team</Button>
                            </div>
                        }
                    </CanManageOrganization>

                </div>
            </div >
        );
    };
}