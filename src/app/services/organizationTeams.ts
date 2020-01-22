
import AhoraRestCollector from "./base";

export interface OrganizationTeam {
    id?: number;
    parentId: number;
    name: string;
    organizationId: number;
}

const orgTeamsClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/teams/{id}");
export const getTeams = async (parentId: number | null): Promise<OrganizationTeam[]> => {
    const result = await orgTeamsClient.get({ query: { parentId: parentId ? parentId : "null" } });
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