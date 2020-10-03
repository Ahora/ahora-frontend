import { User } from "./users";

export interface DirectMessageTopic {
    id: number;
    users: User[];
}

export interface DirectMessage {
    id: number;
    author: User;
    authorId: number;
}

export const getDirectTopics = (): DirectMessageTopic[] => {
    return [];
}

export const getDirectMessages = (topicId: number): DirectMessage[] => {
    return [];
}