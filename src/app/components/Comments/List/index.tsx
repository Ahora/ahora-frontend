import * as React from 'react';
import { addComment, Comment, getComments } from 'app/services/comments';
import { CommentDetailsComponent } from '../Details';
import AddCommentComponent from 'app/components/Comments/AddComment';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import { Doc } from 'app/services/docs';

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

    async commentAdded(comment: Comment) {
        const comments: Comment[] = [...this.state.comments, comment];
        this.setState({
            comments,
            focusId: comment.id,
            qouteComment: undefined
        });

        const newComment: Comment = await addComment(this.props.login, this.props.doc.id, comment.comment, comment.parentId);
        this.setState({ focusId: newComment.id, comments: this.state.comments!.map((currentComment) => comment.id === currentComment.id ? newComment : currentComment) })

    }

    async onQoute(comment: Comment) {
        this.setState({ qouteComment: comment });
    }

    async componentDidUpdate(prevProps: CommentsProps) {
        if (this.props.doc.id !== prevProps.doc.id) {
            this.setState({ comments: undefined, pinnedComments: [] });
            const comments: Comment[] = await getComments(this.props.login, this.props.doc.id);
            this.setState({
                focusId: comments.length > 0 ? comments[comments.length - 1].id : undefined,
                comments,
                pinnedComments: comments.filter(comment => comment.pinned)
            });
        }
    }

    commentSyncedFromSockets(comment: Comment) {
        if (this.state.comments && comment.docId === this.props.doc.id) {
            const comments = [...this.state.comments];
            const index = this.state.comments.findIndex((currentComment) => currentComment.id === comment.id);
            if (index > 0) {
                comments[index] = comment;
            }
            else {
                comments.push(comment);
            }
            this.setState({ comments });
        }

    }

    async componentDidMount() {
        const comments: Comment[] = await getComments(this.props.login, this.props.doc.id);
        this.setState({
            focusId: comments.length > 0 ? comments[comments.length - 1].id : undefined,
            comments,
            pinnedComments: comments.filter(comment => comment.pinned)
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
                                    return (<CommentDetailsComponent key={`${comment.id}-${comment.updatedAt}`} focus={comment.id === this.state.focusId} onQoute={this.onQoute.bind(this)} doc={this.props.doc} onDelete={this.onDeleteComment.bind(this)} login={this.props.login} comment={comment}></CommentDetailsComponent>);
                                })}
                            </div>
                        }
                    </>)
                    :
                    (<AhoraSpinner />)
                }
                <AddCommentComponent qouteComment={this.state.qouteComment} commentAdded={(comment: Comment) => { this.commentAdded(comment) }} login={this.props.login} docId={this.props.doc.id}></AddCommentComponent>
            </div>
        );
    }
}