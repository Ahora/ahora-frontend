import * as React from 'react';
import { Comment, getComments } from 'app/services/comments';
import { CommentDetailsComponent } from '../Details';
import { AddCommentComponent } from 'app/components/Comments/AddComment';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import CanComment from 'app/components/Authentication/CanComment';

interface CommentsProps {
    docId: number;
    login: string;
}

interface State {
    comments?: Comment[];
    pinnedComments?: Comment[];
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
            comments
        });
    }

    async componentDidMount() {
        const comments: Comment[] = await getComments(this.props.login, this.props.docId);
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
                        <h3>Pinned Comments</h3>
                        <div className="list">
                            {this.state.pinnedComments.map((comment: Comment) => {
                                return (<CommentDetailsComponent onDelete={this.onDeleteComment.bind(this)} login={this.props.login} key={comment.id} comment={comment}></CommentDetailsComponent>);
                            })}
                        </div>
                    </>)
                }
                <CanComment>
                    <div className="mt-2 mb-2">
                        <AddCommentComponent commentAdded={(comment) => { this.commentAdded(comment) }} login={this.props.login} docId={this.props.docId}></AddCommentComponent>
                    </div>
                </CanComment>

                {this.state.comments ?
                    (<>
                        {this.state.comments.length > 0 &&
                            <div className="list">
                                {this.state.comments.map((comment: Comment) => {
                                    return (<CommentDetailsComponent onDelete={this.onDeleteComment.bind(this)} login={this.props.login} key={comment.id} comment={comment}></CommentDetailsComponent>);
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