import * as React from 'react';
import { Comment } from 'app/services/comments';
import CommentDetailsComponent from '../Details';
import { Doc } from 'app/services/docs';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { requestCommentsToState, requestPinnedCommentsToState, requestunReadCommentsToState } from 'app/store/comments/actions';
import { Divider, Typography } from 'antd';
import { reportDocRead } from 'app/store/shortcuts/actions';
import InfiniteScroll from 'react-infinite-scroll-component';


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
    hasMore: boolean;
}

interface DispatchProps {
    reportDocRead: () => void;
    loadPinnedMessages: () => void;
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
            this.props.loadPinnedMessages();
        }
    }

    async componentDidUpdate(prevProps: CommentsProps) {
        if (prevProps.focusId != this.props.focusId) {
            this.setState({ focusId: this.props.focusId });
        }

        if (this.props.doc.id !== prevProps.doc.id) {
            this.firstLoad();
        }
    }
    reportDocReadAndCleanFocusId() {
        this.setState({ focusId: undefined });
        this.props.reportDocRead();
    }

    render() {
        return (
            <>
                {this.props.pinnedComments && this.props.pinnedComments.length > 0 &&
                    (<>
                        <Typography.Title level={3}>Pinned:</Typography.Title>
                        {this.props.pinnedComments.map((commentId: number) => {
                            return (<CommentDetailsComponent key={commentId} docId={this.props.doc.id} login={this.props.login} commentId={commentId}></CommentDetailsComponent>);
                        })}
                        <Typography.Title level={3}>Comments:</Typography.Title>
                    </>)
                }

                <InfiniteScroll
                    dataLength={this.props.comments?.length || 0} //This is important field to render the next data
                    next={() => { /*this.loadMoreComments()*/ }}
                    style={{ overflow: "hidden", display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                    hasMore={this.props.hasMore}
                    inverse={true}
                    loader={<></>}
                    scrollableTarget={`scrollableComments${this.props.doc.id}`}
                >
                    {(this.props.moreComments && this.props.moreComments.length > 0) &&
                        <>
                            {this.props.moreComments.map((commentId: number) => { return (<CommentDetailsComponent key={commentId} focus={commentId === this.props.moreCommentFocusId} docId={this.props.doc.id} login={this.props.login} commentId={commentId}></CommentDetailsComponent>); })}
                            <Divider className="divider-new-comments" orientation="right">New comments</Divider>
                        </>
                    }

                    {this.props.comments?.map((commentId: number) => <CommentDetailsComponent key={commentId} focus={commentId === this.state.focusId} docId={this.props.doc.id} login={this.props.login} commentId={commentId}></CommentDetailsComponent>)}


                </InfiniteScroll>

            </>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: CommentsProps): DispatchProps => {
    return {
        reportDocRead: () => dispatch(reportDocRead(ownProps.doc.id)),
        loadComments: () => dispatch(requestCommentsToState(ownProps.doc.id)),
        loadUnReadComments: () => dispatch(requestunReadCommentsToState(ownProps.doc.id)),
        loadPinnedMessages: () => dispatch(requestPinnedCommentsToState(ownProps.doc.id))
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
        moreCommentFocusId: (mapOfComments && mapOfComments.moreComments && mapOfComments.moreComments.length > 0 && !props.focusId) ? mapOfComments.moreComments[0] : undefined,
        pinnedComments: mapOfComments?.pinnedComments,
        hasMore: mapOfComments ? mapOfComments.hasMore : false
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentListComponent as any); 