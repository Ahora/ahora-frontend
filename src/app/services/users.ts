
import AhoraRestCollector from "../sdk/AhoraRestCollector";

export enum UserType {
    User = 0,
    Group = 1
}

export interface UserItem {
    username: string;
    displayName?: string;
    id: number;
    avatar?: string;
}

export interface User {
    id: number;
    displayName: string;
    username: string;
    avatar?: string;
    email: string;
}

const currentUserClient: AhoraRestCollector = new AhoraRestCollector("/api/me");
const userClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/users/{id}");
export const getCurrentUser = async (): Promise<User | undefined> => {
    const result = await currentUserClient.get();
    return result.data;
}

export const getUserById = async (id: number): Promise<UserItem> => {
    const result = await userClient.get({
        params: {
            id
        }
    });
    return result.data;
}

export const searchUsers = async (q: string, userType?: UserType): Promise<UserItem[]> => {
    const result = await userClient.get({
        query: { q, userType }
    });
    return result.data;
}