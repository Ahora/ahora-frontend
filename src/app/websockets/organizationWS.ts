
import { Comment } from "app/services/comments";
import { deleteCommentInState, setCommentAddedInState, setCommentUpdatedInState } from 'app/store/comments/actions';
import io from 'socket.io-client';
import { deleteDocInState, setDocInState } from 'app/store/docs/actions';
import { Doc } from 'app/services/docs';
import { ahoraDispatch } from 'app/store/dispatchHelpers';
import { setWebSocketId } from ".";

export const socket = io({ "transports": ['websocket'] });
setWebSocketId(socket.id);
export default class OrganizationWebSocket {


    constructor(organizationId: string) {

        socket.emit("joinroom", organizationId);

        //Comments
        socket.on('comment-post', (comment: Comment) => {
            ahoraDispatch(setCommentAddedInState(comment));
        });

        socket.on('comment-put', (comment: Comment) => {
            ahoraDispatch(setCommentUpdatedInState(comment));
        });

        socket.on('comment-delete', (comment: Comment) => {
            ahoraDispatch(deleteCommentInState(comment.docId, comment.id));
        });


        //Docs
        socket.on('docs-post', (doc: Doc) => {
            ahoraDispatch(setDocInState(doc));
        });

        socket.on('docs-put', (doc: Doc) => {
            ahoraDispatch(setDocInState(doc));
        });

        socket.on('docs-delete', (doc: Comment) => {
            ahoraDispatch(deleteDocInState(doc.id));
        });
    }

    close() {

    }
}