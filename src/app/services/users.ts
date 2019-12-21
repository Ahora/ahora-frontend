
import { RestCollectorClient } from "rest-collector";
import * as fetch from 'isomorphic-fetch';


export interface User {
    id: number;
    displayName: string;
    username: string;
    email: string;
}

const SEARCH_URI = 'https://api.github.com/search/users';

export function makeAndHandleRequest(query: string, page = 1) {
    return fetch(`${SEARCH_URI}?q=${query}+in:login&page=${page}&per_page=50`)
        .then((resp: any) => resp.json())
        .then((data: any) => { /* eslint-disable-line camelcase */
            const options = data.items.map((i: any) => ({
                avatar_url: i.avatar_url,
                id: i.id,
                login: i.login,
            }));
            return { options, total_count: data.total_count };
        });
}
const currentUserClient: RestCollectorClient = new RestCollectorClient("/api/me");
export const getCurrentUser = async (): Promise<User | undefined> => {
    const result = await currentUserClient.get();
    return result.data;
}
