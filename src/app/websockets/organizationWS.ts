
import { Comment } from "app/services/comments";
import { AddCommentInState, deleteCommentInState, setCommentAddedInState, setCommentUpdatedInState } from 'app/store/comments/actions';
import io from 'socket.io-client';
import { deleteDocInState, setDocInState } from 'app/store/docs/actions';
import { Doc } from 'app/services/docs';
import { ahoraDispatch } from 'app/store/dispatchHelpers';
import { setWebSocketId } from ".";
import { store } from "app/store";

export const socket = io({ "transports": ['websocket'] });
socket.on('connect', () => { setWebSocketId(socket.id); });
socket.on('reconnect', () => { setWebSocketId(socket.id); });

export default class OrganizationWebSocket {


    constructor(organizationId: string) {

        socket.emit("joinroom", organizationId);

        //Comments
        socket.on('comment-post', (comment: Comment) => {
            //If it's the same user don't show it as unread comment. treat it as comment that added by the user.
            if (store.getState().currentUser.user?.id === comment.authorUserId) {
                ahoraDispatch(AddCommentInState(comment));
            }
            else {
                ahoraDispatch(setCommentAddedInState(comment));
            }
        });

        socket.on('comment-docupdate', (comment: Comment) => {
            //If it's the same user don't show it as unread comment. treat it as comment that added by the user.
            if (store.getState().currentUser.user?.id === comment.authorUserId) {
                ahoraDispatch(AddCommentInState(comment));
            }
            else {
                ahoraDispatch(setCommentAddedInState(comment));

            }
        });

        socket.on('comment-put', (comment: Comment) => {
            ahoraDispatch(setCommentUpdatedInState(comment));
        });

        socket.on('comment-delete', (comment: Comment) => {
            ahoraDispatch(deleteCommentInState(comment.docId, comment.id));
        });


        //Docs
        socket.on('doc-post', (doc: Doc) => {
            ahoraDispatch(setDocInState(doc));
        });

        socket.on('doc-put', (doc: Doc) => {
            ahoraDispatch(setDocInState(doc));
        });

        socket.on('doc-delete', (doc: Comment) => {
            ahoraDispatch(deleteDocInState(doc.id));
        });
    }

    close() {

    }
}