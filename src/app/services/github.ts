
import AhoraRestCollector from "../sdk/AhoraRestCollector";

const githubClient: AhoraRestCollector = new AhoraRestCollector("/api/github/search/users");
const githubRepoClient: AhoraRestCollector = new AhoraRestCollector("/api/github/search/repositories");

export const searchGithubUsers = async (q: string): Promise<any> => {
    const result = await githubClient.get({
        query: { q }
    });

    return result.data;
}

export const searchGithubRepositories = async (q: string, owner: string, isOrg: boolean): Promise<any> => {
    const result = await githubRepoClient.get({
        query: { q, owner, isOrg }
    });

    return result.data;
}