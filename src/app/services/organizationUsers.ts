
import { RestCollectorClient } from "rest-collector";

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



const orgUsersClient: RestCollectorClient = new RestCollectorClient("/api/organizations/{organizationId}/users/{id}");
export const getUsersByOrganization = async (): Promise<OrganizationUser[]> => {
    const result = await orgUsersClient.get({
        params: { organizationId: "ahora" }
    });
    return result.data;
}


export const deleteUserMethod = async (user: OrganizationUser): Promise<void> => {
    await orgUsersClient.delete({
        params: { organizationId: "ahora", id: user.id! }
    })
}

export const addUser = async (login: string, permission: number = 1): Promise<OrganizationUser> => {
    const result = await orgUsersClient.post({
        params: { organizationId: "ahora" },
        data: { login, permission }
    });

    return result.data;
}