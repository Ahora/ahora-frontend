import * as React from 'react';
import { deleteOrganizationTeamMethod, OrganizationTeam, getTeamById, addOrganizationTeam, getTeams, OrganizationTeamUser, getUsersByTeam, deleteUserFromTeam, updateTeamName, TeamUserType } from 'app/services/organizationTeams';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import EditableHeader from 'app/components/EditableHeader';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import CanManageOrganization from 'app/components/Authentication/CanManageOrganization';
import { AddTeamMemberForm } from 'app/components/Teams/AddTeamMemberForm';
import { Table, Button, Popconfirm } from 'antd';
import AhoraForm from 'app/components/Forms/AhoraForm/AhoraForm';
import AhoraField from 'app/components/Forms/AhoraForm/AhoraField';
import { UserItem } from 'app/services/users';
import UserDetails from 'app/components/users/UserDetails';

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

    async onSubmit(data: any): Promise<void> {
        if (data.teamNameVal && data.teamNameVal.trim().length > 0) {
            const addedTeam = await addOrganizationTeam(data.teamNameVal.trim(), this.state.team && this.state.team.id);
            this.setState({
                subTeams: [addedTeam, ...this.state.subTeams || []],
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
            users: [addedUser, ...this.state.users || []]
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
            <div className="wrap-content">
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
                                <Table className="content-toside" dataSource={this.state.users} rowKey="id">
                                    <Table.Column title="User" dataIndex="User" key="User" render={(user: UserItem) => <UserDetails user={user} />} />
                                    <Table.Column title="type" dataIndex="permissionType" key="permissionType" render={(permissionType: TeamUserType) =>
                                        <>{permissionType === TeamUserType.Member ? "Member" : "Owner"}</>
                                    } />
                                    <Table.Column title="Actions" render={(value: any, user: OrganizationTeamUser) =>
                                        <CanManageOrganization>
                                            <Popconfirm onConfirm={this.deleteUser.bind(this, user)} title="Are you sure?">
                                                <Button danger>Delete</Button>
                                            </Popconfirm>
                                        </CanManageOrganization>
                                    } />
                                </Table> :
                                <p>No members</p>
                            }
                        </>
                        : (<AhoraSpinner />)
                    }
                    <div>
                        <h2>Sub Teams</h2>
                        <CanManageOrganization>
                            <AhoraForm submitButtonText="Add" data={{ teamNameVal: "" }} onSumbit={this.onSubmit.bind(this)}>
                                <AhoraField fieldType="text" fieldName="teamNameVal" displayName="name" required={true} />
                            </AhoraForm>
                        </CanManageOrganization>
                    </div>
                    {this.state.subTeams ?
                        <>
                            {this.state.subTeams.length > 0 ?

                                <Table className="content-toside" dataSource={this.state.subTeams} rowKey="id">
                                    <Table.Column title="name" dataIndex="name" key="name" render={(name: string, team: OrganizationTeam) =>
                                        <Link to={`/organizations/${this.props.match.params.login}/teams/${team.id}`}>{team.name}</Link>
                                    } />
                                </Table> : <p>No teams</p>
                            }
                        </>
                        : (<AhoraSpinner />)
                    }
                    <CanManageOrganization>
                        {this.state.team &&
                            <div>
                                <h2>Danger Zone</h2>
                                <Popconfirm onConfirm={this.deleteTeam.bind(this)} title="Are you sure?">
                                    <Button type="primary" danger>Delete Team</Button>
                                </Popconfirm>
                            </div>
                        }
                    </CanManageOrganization>

                </div>
            </div >
        );
    };
}