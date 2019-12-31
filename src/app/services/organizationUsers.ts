
import AhoraRestCollector from "./base";

export interface OrganizationUser {
    id?: number;
    userId: number;
    permission: number;
    organizationId: number;
    user: {
        username: string;
        displayName: string
    }
}



const orgUsersClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/users/{id}");
export const getUsersByOrganization = async (): Promise<OrganizationUser[]> => {
    const result = await orgUsersClient.get();
    return result.data;
}


export const deleteUserMethod = async (user: OrganizationUser): Promise<void> => {
    await orgUsersClient.delete({
        params: { id: user.id! }
    })
}

export const addUser = async (login: string, permission: number = 1): Promise<OrganizationUser> => {
    const result = await orgUsersClient.post({
        data: { login, permission }
    });

    return result.data;
}