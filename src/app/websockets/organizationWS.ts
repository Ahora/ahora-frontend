
import io,  from 'socket.io-client';

export default class OrganizationWebSocket {

    private socket: any;

    constructor(organizationId: string) {
        const socket = io.connect({ transports: ['websocket'], upgrade: false });
        this.socket = socket;

        this.socket.on('reconnect_attempt', () => {
            this.socket.io.opts.transports = ['websocket'];
        });

        socket.on('connect', () => {
            this.socket.emit('room', organizationId);
        });

        socket.on('comment-post', (comment: Comment) => {
            //this.commentSyncedFromSockets(comment);
        });

        socket.on('comment-put', (comment: Comment) => {
            //this.commentSyncedFromSockets(comment);
        });

        socket.on('comment-delete', (comment: Comment) => {
            //if (comment.docId === this.props.doc.id) {
            //this.onDeleteComment(comment.id);
            //}
        });
    }
}