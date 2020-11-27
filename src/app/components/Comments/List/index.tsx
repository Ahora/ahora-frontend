import * as React from 'react';
import { Comment } from 'app/services/comments';
import { CommentDetailsComponent } from '../Details';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import { Doc } from 'app/services/docs';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { AddCommentInState, clearUnReadCommentsInState, deleteCommentInState, requestCommentsToState } from 'app/store/comments/actions';
import { Divider } from 'antd';
import VisibilitySensor from 'react-visibility-sensor';

interface InjectableProps {
    moreComments?: Comment[];
    loading?: boolean;
    canPostComment: boolean;
    comments?: Comment[];
    pinnedComments?: Comment[];
    focusId?: number;
}

interface DispatchProps {
    clearUnReadComments: () => void;
    deleteComment: (commentId: number) => void;
    addComment: (omment: Comment) => void;
    loadComments: (toDate?: Date) => void;
}

interface CommentsProps extends InjectableProps, DispatchProps {
    doc: Doc;
    login: string;
}

interface State {
    qouteComment?: Comment;
    focusId?: number;
}


class CommentListComponent extends React.Component<CommentsProps, State>  {
    constructor(props: CommentsProps) {
        super(props);
        this.state = { focusId: props.focusId }
    }

    onDeleteComment(id: number): void {
        this.props.deleteComment(id);
    }

    async onQoute(comment: Comment) {
        this.setState({ qouteComment: comment });
    }

    loadMoreComments() {
        this.props.loadComments();
    }

    async componentDidUpdate(prevProps: CommentsProps) {
        let focusId = this.state.focusId;
        if (prevProps.focusId != this.props.focusId) {
            focusId = this.props.focusId;
        }

        if (this.props.moreComments && this.props.moreComments.length > 0 && this.props.moreComments[0].id !== focusId) {
            focusId = this.props.moreComments[0].id;
        }

        if (focusId !== this.state.focusId) {
            this.setState({ focusId });
        }
    }


    async componentDidMount() {
        if (!this.props.comments) {

            const comments = [...this.props.comments || [], ...this.props.moreComments || [],]
            let toDate: Date | undefined;
            if (comments?.length > 0) {
                toDate = comments[0].createdAt
            }
            this.props.loadComments(toDate);
        }
    }

    render() {
        return (
            <>
                <VisibilitySensor onChange={(visible: boolean) => { if (visible) this.loadMoreComments(); }}>
                    <span>&nbsp;</span>
                </VisibilitySensor>
                {this.props.pinnedComments && this.props.pinnedComments.length > 0 &&
                    (<>
                        <div className="list">
                            {this.props.pinnedComments.map((comment: Comment) => {
                                return (<CommentDetailsComponent focus={comment.id === this.state.focusId} onQoute={this.onQoute.bind(this)} doc={this.props.doc} onDelete={this.onDeleteComment.bind(this)} login={this.props.login} key={comment.id} comment={comment}></CommentDetailsComponent>);
                            })}
                        </div>
                    </>)
                }

                {this.props.loading && <AhoraSpinner />}


                {this.props.comments && this.props.comments.length > 0 &&
                    <div className="list">
                        {this.props.comments.map((comment: Comment) => {
                            return (<CommentDetailsComponent key={`${comment.id}-${comment.updatedAt}`} focus={comment.id === this.state.focusId} onQoute={this.onQoute.bind(this)} doc={this.props.doc} onDelete={this.onDeleteComment.bind(this)} login={this.props.login} comment={comment}></CommentDetailsComponent>);
                        })}
                    </div>

                }

                {this.props.moreComments && this.props.moreComments.length > 0 &&
                    <div>
                        <Divider orientation="right">New comments {this.props.focusId}</Divider>
                        <div className="list">
                            {this.props.moreComments.map((comment: Comment) => {
                                return (<CommentDetailsComponent key={`${comment.id}-${comment.updatedAt}`} focus={comment.id === this.state.focusId} onQoute={this.onQoute.bind(this)} doc={this.props.doc} onDelete={this.onDeleteComment.bind(this)} login={this.props.login} comment={comment}></CommentDetailsComponent>);
                            })}
                        </div>
                        <br /><br /><br />
                        <VisibilitySensor onChange={(visible: boolean) => {
                            if (visible) this.props.clearUnReadComments();
                        }}>
                            <span>&nbsp;</span>
                        </VisibilitySensor>
                    </div>
                }
            </>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: CommentsProps): DispatchProps => {
    return {
        clearUnReadComments: () => dispatch(clearUnReadCommentsInState(ownProps.doc.id)),
        deleteComment: (commentId: number) => dispatch(deleteCommentInState(ownProps.doc.id, commentId)),
        addComment: (comment: Comment) => dispatch(AddCommentInState(comment)),
        loadComments: (toDate?: Date) => dispatch(requestCommentsToState(ownProps.doc.id, toDate))
    }
}

function idToComment(commentId: number, map: Map<number, Comment>): Comment | undefined {
    return map.get(commentId);
}

function numberIdsToComments(commentIds?: number[], map?: Map<number, Comment>): Comment[] | undefined {
    if (commentIds && map) {
        const comments: Comment[] = [];
        for (let index = 0; index < commentIds.length; index++) {
            const comment = idToComment(commentIds[index], map);

            if (comment) {
                comments.push(comment);
            }
        }
        return comments;
    }
    return undefined;
}

const mapStateToProps = (state: ApplicationState, props: CommentsProps): InjectableProps => {
    const mapOfComments = state.comments.docs.get(props.doc.id);
    const comments = numberIdsToComments(mapOfComments?.comments, mapOfComments?.map);
    return {
        loading: mapOfComments?.loading,
        canPostComment: !!state.currentUser.user,
        moreComments: numberIdsToComments(mapOfComments?.moreComments, mapOfComments?.map),
        comments
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentListComponent as any); 