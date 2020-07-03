
import AhoraRestCollector from "./base";

export enum TeamUserType {
    Member = 0,
    Owner = 1
}

export interface OrganizationTeam {
    id: number;
    parentId: number;
    name: string;
    organizationId: number;
}

export interface OrganizationTeamUser {
    id: number;
    teamId: number;
    userId: number;
    permissionType: TeamUserType,
    organizationId: number;
    User: {
        displayName: string;
        username: string;
    }
}

const orgTeamsClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/teams/{id}");
const orgTeamsUsersClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/teams/{teamId}/users/{id}");
export const getTeams = async (parentId: number | null): Promise<OrganizationTeam[]> => {
    const result = await orgTeamsClient.get({ query: { parentId: parentId ? parentId : "null" } });
    return result.data;
}

export const getAllTeams = async (): Promise<OrganizationTeam[]> => {
    const result = await orgTeamsClient.get();
    return result.data;
}

export const getUsersByTeam = async (teamId: number | null): Promise<OrganizationTeamUser[]> => {
    const result = await orgTeamsUsersClient.get({ params: { teamId: teamId ? teamId : "null" } });
    return result.data;
}

export const getTeamById = async (id: number): Promise<OrganizationTeam> => {
    const result = await orgTeamsClient.get({ params: { id } });
    return result.data;
}


export const deleteOrganizationTeamMethod = async (user: OrganizationTeam): Promise<void> => {
    await orgTeamsClient.delete({
        params: { id: user.id! }
    })
}

export const addOrganizationTeam = async (name: string, parentId: number | null = null): Promise<OrganizationTeam> => {
    const result = await orgTeamsClient.post({
        data: { name, parentId }
    });

    return result.data;
}

export const updateTeamName = async (name: string, id: number): Promise<OrganizationTeam> => {
    const result = await orgTeamsClient.put({
        params: { id },
        data: { name }
    });

    return result.data;
}

export const addUser = async (userId: number, teamId: number | null = null): Promise<OrganizationTeamUser> => {
    const result = await orgTeamsUsersClient.post({
        params: { teamId },
        data: { userId }
    });

    return result.data;
}

export const deleteUserFromTeam = async (id: number, teamId: number | null = null): Promise<void> => {
    await orgTeamsUsersClient.delete({
        params: { teamId, id },
    });
}