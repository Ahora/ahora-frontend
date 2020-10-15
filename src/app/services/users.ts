
import { RestCollectorClient } from "rest-collector";

export interface UserItem {
    username: string;
    displayName?: string;
    id: number
}

export interface User {
    id: number;
    displayName: string;
    username: string;
    email: string;
}

const currentUserClient: RestCollectorClient = new RestCollectorClient("/api/me");
const userClient: RestCollectorClient = new RestCollectorClient("/api/users/{id}");
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

export const searchUsers = async (q: string): Promise<UserItem[]> => {
    const result = await userClient.get({
        query: { q }
    });
    return result.data;
}