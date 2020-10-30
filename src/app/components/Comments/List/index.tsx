import * as React from 'react';
import { Comment, getComments } from 'app/services/comments';
import { CommentDetailsComponent } from '../Details';
import { AddCommentComponent } from 'app/components/Comments/AddComment';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import { Doc } from 'app/services/docs';
import io from 'socket.io-client';

interface CommentsProps {
    doc: Doc;
    login: string;
}

interface State {
    comments?: Comment[];
    pinnedComments?: Comment[];
    qouteComment?: Comment;
    focusId?: number;
}

export class CommentListComponent extends React.Component<CommentsProps, State> {

    constructor(props: CommentsProps) {
        super(props);

        this.state = {}
    }

    onDeleteComment(id: number): void {
        this.setState({
            comments: this.state.comments!.filter((comment) => comment.id !== id)
        })
    }

    commentAdded(comment: Comment): void {
        const comments: Comment[] = [...this.state.comments, comment];
        this.setState({
            comments,
            focusId: comment.id,
            qouteComment: undefined
        });
    }

    async onQoute(comment: Comment) {
        this.setState({ qouteComment: comment });
    }

    async componentDidUpdate(prevProps: CommentsProps) {
        if (this.props.doc.id !== prevProps.doc.id) {
            this.setState({ comments: undefined, pinnedComments: [] });
            const comments: Comment[] = await getComments(this.props.login, this.props.doc.id);
            this.setState({
                comments,
                pinnedComments: comments.filter(comment => comment.pinned)
            });
        }
    }

    async componentDidMount() {
        const comments: Comment[] = await getComments(this.props.login, this.props.doc.id);
        this.setState({
            comments,
            pinnedComments: comments.filter(comment => comment.pinned)
        });
        var socket = io.connect({ transports: ['websocket'], upgrade: false });
        // on reconnection, reset the transports option, as the Websocket
        // connection may have failed (caused by proxy, firewall, browser, ...)
        socket.on('reconnect_attempt', () => {
            socket.io.opts.transports = ['websocket'];
        });
        socket.on('connect', () => {
            // Connected, let's sign-up for to receive messages for this room
            socket.emit('room', `doc-${this.props.doc.id}`);
        });

        socket.on('comment-post', (comment: Comment) => {
            if (comment.docId === this.props.doc.id) {
                this.commentAdded(comment);
            }
        });

        socket.on('comment-put', (comment: Comment) => {
            if (this.state.comments && comment.docId === this.props.doc.id) {
                this.setState({
                    comments: this.state.comments.map((currentComment) => currentComment.id === comment.id ? comment : currentComment)
                });
            }
        });

        socket.on('comment-delete', (comment: Comment) => {
            if (comment.docId === this.props.doc.id) {
                this.onDeleteComment(comment.id);
            }
        });
    }

    render() {
        return (
            <div>
                {this.state.pinnedComments && this.state.pinnedComments.length > 0 &&
                    (<>
                        <div className="list">
                            {this.state.pinnedComments.map((comment: Comment) => {
                                return (<CommentDetailsComponent focus={false} onQoute={this.onQoute.bind(this)} doc={this.props.doc} onDelete={this.onDeleteComment.bind(this)} login={this.props.login} key={comment.id} comment={comment}></CommentDetailsComponent>);
                            })}
                        </div>
                    </>)
                }


                {this.state.comments ?
                    (<>
                        {this.state.comments.length > 0 &&
                            <div className="list">
                                {this.state.comments.map((comment: Comment) => {
                                    return (<CommentDetailsComponent focus={comment.id === this.state.focusId} onQoute={this.onQoute.bind(this)} doc={this.props.doc} onDelete={this.onDeleteComment.bind(this)} login={this.props.login} key={`${comment.id}-${comment.updatedAt}`} comment={comment}></CommentDetailsComponent>);
                                })}
                            </div>
                        }
                    </>)
                    :
                    (<AhoraSpinner />)
                }
                <AddCommentComponent qouteComment={this.state.qouteComment} commentAdded={(comment) => { this.commentAdded(comment) }} login={this.props.login} docId={this.props.doc.id}></AddCommentComponent>
            </div>
        );
    }
}