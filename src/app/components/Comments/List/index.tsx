import * as React from 'react';
import { Comment } from 'app/services/comments';
import CommentDetailsComponent from '../Details';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import { Doc } from 'app/services/docs';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { AddCommentInState, deleteCommentInState, requestCommentsToState } from 'app/store/comments/actions';
import { Divider } from 'antd';
import VisibilitySensor from 'react-visibility-sensor';
import { reportDocRead } from 'app/store/shortcuts/actions';

require("./style.scss")

interface InjectableProps {
    moreComments?: number[];
    loading?: boolean;
    canPostComment: boolean;
    comments?: number[];
    pinnedComments?: number[];
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

        if (this.props.moreComments && this.props.moreComments.length > 0 && this.props.moreComments[0] !== focusId) {
            focusId = this.props.moreComments[0];
        }

        if (focusId !== this.state.focusId) {
            this.setState({ focusId });
        }

        if (this.props.doc.id !== prevProps.doc.id) {
            this.loadMoreComments();
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
                            {this.props.pinnedComments.map((commentId: number) => {
                                return (<CommentDetailsComponent key={commentId} focus={commentId === this.state.focusId} onQoute={this.onQoute.bind(this)} doc={this.props.doc} onDelete={this.onDeleteComment.bind(this)} login={this.props.login} commentId={commentId}></CommentDetailsComponent>);
                            })}
                        </div>
                    </>)
                }

                {this.props.loading && <AhoraSpinner />}


                {this.props.comments && this.props.comments.length > 0 &&
                    <div className="list">
                        {this.props.comments.map((commentId: number) => {
                            return (<CommentDetailsComponent key={commentId} focus={commentId === this.state.focusId} onQoute={this.onQoute.bind(this)} doc={this.props.doc} onDelete={this.onDeleteComment.bind(this)} login={this.props.login} commentId={commentId}></CommentDetailsComponent>);
                        })}
                    </div>

                }

                {this.props.moreComments && this.props.moreComments.length > 0 &&
                    <div>
                        <Divider className="divider-new-comments" orientation="right">New comments</Divider>
                        <div className="list">
                            {this.props.moreComments.map((commentId: number) => {
                                return (<CommentDetailsComponent key={commentId} focus={commentId === this.state.focusId} onQoute={this.onQoute.bind(this)} doc={this.props.doc} onDelete={this.onDeleteComment.bind(this)} login={this.props.login} commentId={commentId}></CommentDetailsComponent>);
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
        clearUnReadComments: () => dispatch(reportDocRead(ownProps.doc.id)),
        deleteComment: (commentId: number) => dispatch(deleteCommentInState(ownProps.doc.id, commentId)),
        addComment: (comment: Comment) => dispatch(AddCommentInState(comment)),
        loadComments: (toDate?: Date) => dispatch(requestCommentsToState(ownProps.doc.id, toDate))
    }
}

const mapStateToProps = (state: ApplicationState, props: CommentsProps): InjectableProps => {
    const mapOfComments = state.comments.docs.get(props.doc.id);
    return {
        loading: mapOfComments?.loading,
        canPostComment: !!state.currentUser.user,
        moreComments: mapOfComments?.moreComments,
        comments: mapOfComments?.comments
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentListComponent as any); 