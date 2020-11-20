
import { store } from 'app/store';
import { Comment } from "app/services/comments";
import { deleteCommentInState, setCommentInState } from 'app/store/comments/actions';
import io from 'socket.io-client';

export default class OrganizationWebSocket {

    private socket: any;

    constructor(organizationId: string) {
        const socket = io();


        socket.on('comment-post', (comment: Comment) => {
            store.dispatch(setCommentInState(comment));
        });

        socket.on('comment-put', (comment: Comment) => {
            store.dispatch(setCommentInState(comment));
        });

        socket.on('comment-delete', (comment: Comment) => {
            store.dispatch(deleteCommentInState(comment.docId, comment.id));
        });

    }

    close() {
        this.socket.close();
    }
}