import * as React from 'react';
import { Comment } from 'app/services/comments';
import CommentDetailsComponent from '../Details';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import { Doc } from 'app/services/docs';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { requestCommentsToState, requestunReadCommentsToState } from 'app/store/comments/actions';
import { Divider } from 'antd';
import { reportDocRead } from 'app/store/shortcuts/actions';

require("./style.scss")

interface InjectableProps {
    moreComments?: number[];
    loading?: boolean;
    canPostComment: boolean;
    comments?: number[];
    pinnedComments?: number[];
    focusId?: number;
    moreCommentFocusId?: number;
    unReadCommentsCount?: number;
}

interface DispatchProps {
    reportDocRead: () => void;
    loadComments: (toDate?: Date) => void;
    loadUnReadComments: (toDate?: Date) => void;
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
    private endElement: React.RefObject<HTMLDivElement>;

    constructor(props: CommentsProps) {
        super(props);
        this.state = { focusId: props.focusId }
        this.endElement = React.createRef();
    }

    public scrollToEnd() {
        if (this.endElement.current) {
            this.endElement.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    }

    componentDidMount() {
        this.firstLoad();
    }


    firstLoad() {
        //Load information only if there are no comments available.
        if (!this.props.comments && !this.props.loading) {
            this.props.loadComments();
        }

        let focusId: number | undefined = undefined;
        if (this.props.moreComments) {
            focusId = this.props.moreComments[0];
        }
        else {
            if (this.props.comments && this.props.comments.length > 0) {
                focusId = this.props.comments[0];

            }
        }

        this.setState({ focusId });
    }

    async componentDidUpdate(prevProps: CommentsProps) {
        if (prevProps.focusId != this.props.focusId) {
            this.setState({ focusId: this.props.focusId });
        }

        if (prevProps.comments)

            if (this.props.doc.id !== prevProps.doc.id) {
                this.firstLoad();
            }
    }
    reportDocReadAndCleanFocusId() {
        this.setState({ focusId: undefined });
        setTimeout(() => {
            this.props.reportDocRead();
        }, 0);
    }

    render() {
        return (
            <>
                {this.props.pinnedComments && this.props.pinnedComments.length > 0 &&
                    (<>
                        <div className="list">
                            {this.props.pinnedComments.map((commentId: number) => {
                                return (<CommentDetailsComponent key={commentId} focus={commentId === this.state.focusId} doc={this.props.doc} login={this.props.login} commentId={commentId}></CommentDetailsComponent>);
                            })}
                        </div>
                    </>)
                }

                {this.props.loading && <AhoraSpinner />}


                {this.props.comments && this.props.comments.length > 0 &&
                    <div className="list">
                        {this.props.comments.map((commentId: number) => <CommentDetailsComponent key={commentId} focus={commentId === this.props.focusId} doc={this.props.doc} login={this.props.login} commentId={commentId}></CommentDetailsComponent>)}
                    </div>
                }

                {(this.props.moreComments && this.props.moreComments.length > 0) &&
                    <div ref={this.endElement}>
                        <Divider className="divider-new-comments" orientation="right">New comments</Divider>
                        <div className="list">
                            {this.props.moreComments.map((commentId: number) => {
                                return (<CommentDetailsComponent key={commentId} focus={commentId === this.props.moreCommentFocusId} doc={this.props.doc} login={this.props.login} commentId={commentId}></CommentDetailsComponent>);
                            })}
                        </div>
                    </div>
                }
            </>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: CommentsProps): DispatchProps => {
    return {
        reportDocRead: () => dispatch(reportDocRead(ownProps.doc.id)),
        loadComments: () => dispatch(requestCommentsToState(ownProps.doc.id)),
        loadUnReadComments: () => dispatch(requestunReadCommentsToState(ownProps.doc.id))
    }
}

const mapStateToProps = (state: ApplicationState, props: CommentsProps): InjectableProps => {
    const mapOfComments = state.comments.docs.get(props.doc.id);
    return {
        loading: mapOfComments ? mapOfComments.loading : false,
        canPostComment: !!state.currentUser.user,
        moreComments: mapOfComments?.moreComments,
        comments: mapOfComments?.comments,
        unReadCommentsCount: mapOfComments?.unReadCommentsCount,
        moreCommentFocusId: (mapOfComments && mapOfComments.moreComments && mapOfComments.moreComments.length > 0 && !props.focusId) ? mapOfComments.moreComments[0] : undefined
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentListComponent as any); 