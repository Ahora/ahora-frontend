
import AhoraRestCollector from "../sdk/AhoraRestCollector";

export interface RawReaction {
    content: string;
}

export interface Reaction extends RawReaction {
    id: number;

}

const reactionesClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/reactions/{id}");

export const getList = async (): Promise<Reaction[]> => {
    const result = await reactionesClient.get();
    return result.data;
};

export const getReaction = async (id: number): Promise<Reaction> => {
    const result = await reactionesClient.get({
        params: { id }
    });
    return result.data;
};

export const searchReactions = async (q: string): Promise<Reaction[]> => {
    const result = await reactionesClient.get({
        query: { q }
    });
    return result.data;
}