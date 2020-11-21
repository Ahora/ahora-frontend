
import { store } from 'app/store';
import { Comment } from "app/services/comments";
import { deleteCommentInState, setCommentInState } from 'app/store/comments/actions';
import io from 'socket.io-client';
import { deleteDocInState, setDocInState } from 'app/store/docs/actions';
import { Doc } from 'app/services/docs';

export default class OrganizationWebSocket {

    private socket: any;

    constructor(organizationId: string) {
        const socket = io();

        //Comments
        socket.on('comment-post', (comment: Comment) => {
            store.dispatch(setCommentInState(comment));
        });

        socket.on('comment-put', (comment: Comment) => {
            store.dispatch(setCommentInState(comment));
        });

        socket.on('comment-delete', (comment: Comment) => {
            store.dispatch(deleteCommentInState(comment.docId, comment.id));
        });


        //Docs
        socket.on('docs-post', (doc: Doc) => {
            store.dispatch(setDocInState(doc));
        });

        socket.on('docs-put', (doc: Doc) => {
            store.dispatch(setDocInState(doc));
        });

        socket.on('docs-delete', (doc: Comment) => {
            store.dispatch(deleteDocInState(doc.id));
        });
    }

    close() {
        this.socket.close();
    }
}