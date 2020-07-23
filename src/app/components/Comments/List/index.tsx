import * as React from 'react';
import { Comment, getComments } from 'app/services/comments';
import { CommentDetailsComponent } from '../Details';
import { AddCommentComponent } from 'app/components/Comments/AddComment';
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
        const comments: Comment[] = [comment, ...this.state.comments];
        this.setState({
            comments,
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
    }

    render() {
        return (
            <div>
                {this.state.pinnedComments && this.state.pinnedComments.length > 0 &&
                    (<>
                        <div className="list">
                            {this.state.pinnedComments.map((comment: Comment) => {
                                return (<CommentDetailsComponent onQoute={this.onQoute.bind(this)} doc={this.props.doc} onDelete={this.onDeleteComment.bind(this)} login={this.props.login} key={comment.id} comment={comment}></CommentDetailsComponent>);
                            })}
                        </div>
                    </>)
                }
                <div style={{ margin: "5px 0px" }}>
                    <AddCommentComponent qouteComment={this.state.qouteComment} commentAdded={(comment) => { this.commentAdded(comment) }} login={this.props.login} docId={this.props.doc.id}></AddCommentComponent>
                </div>

                {this.state.comments ?
                    (<>
                        {this.state.comments.length > 0 &&
                            <div className="list">
                                {this.state.comments.map((comment: Comment) => {
                                    return (<CommentDetailsComponent onQoute={this.onQoute.bind(this)} doc={this.props.doc} onDelete={this.onDeleteComment.bind(this)} login={this.props.login} key={comment.id} comment={comment}></CommentDetailsComponent>);
                                })}
                            </div>
                        }
                    </>) :
                    (<AhoraSpinner />)
                }
            </div>
        );
    }
}