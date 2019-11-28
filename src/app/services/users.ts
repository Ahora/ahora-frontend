
import { RestCollectorClient } from "rest-collector";

export interface User {
    id: number;
    displayName: string;
    username: string;
    email: string;
}

const currentUserClient: RestCollectorClient = new RestCollectorClient("/api/me");
export const getCurrentUser = async (): Promise<User | undefined> => {
    const result = await currentUserClient.get();
    return result.data;
}
