
import AhoraRestCollector from "./base";

export interface OrganizationTeam {
    id?: number;
    parentId: number;
    name: string;
    organizationId: number;
}

const orgTEamsClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/teams/{id}");
export const getTeamsByOrganization = async (): Promise<OrganizationTeam[]> => {
    const result = await orgTEamsClient.get();
    return result.data;
}


export const deleteOrganizationTeamMethod = async (user: OrganizationTeam): Promise<void> => {
    await orgTEamsClient.delete({
        params: { id: user.id! }
    })
}

export const addOrganizationTeam = async (name: string): Promise<OrganizationTeam> => {
    const result = await orgTEamsClient.post({
        data: { name }
    });

    return result.data;
}