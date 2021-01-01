import * as React from 'react';
import { Comment } from 'app/services/comments';
import CommentDetailsComponent from '../Details';
import { Doc } from 'app/services/docs';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { requestCommentsToState } from 'app/store/comments/actions';
import { Divider } from 'antd';
import VisibilitySensor from 'react-visibility-sensor';
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
    hasMore: boolean;
}

interface DispatchProps {
    reportDocRead: () => void;
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

    loadMoreComments() {
        this.props.loadComments();
    }

    componentDidMount() {
        this.props.loadComments();
    }

    async componentDidUpdate(prevProps: CommentsProps) {
        let focusId = this.state.focusId;
        if (!focusId && prevProps.focusId != this.props.focusId) {
            focusId = this.props.focusId;
        }

        if (this.props.moreComments && this.props.moreComments.length > 0 && this.props.moreComments[this.props.moreComments.length - 1] !== focusId) {
            focusId = this.props.moreComments[this.props.moreComments.length - 1];
        }
        else if (this.props.comments && this.props.comments.length > 0) {
            focusId = this.props.comments[0];
        }


        if (focusId !== this.state.focusId) {
            this.setState({ focusId });
        }

        if (this.props.doc.id !== prevProps.doc.id) {
            this.loadMoreComments();
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
                        <div className="list">
                            {this.props.pinnedComments.map((commentId: number) => {
                                return (<CommentDetailsComponent key={commentId} focus={commentId === this.state.focusId} docId={this.props.doc.id} login={this.props.login} commentId={commentId}></CommentDetailsComponent>);
                            })}
                        </div>
                    </>)
                }
                <div>{this.props.hasMore}</div>

                {this.props.comments && this.props.comments.length > 0 &&

                    <InfiniteScroll
                        dataLength={this.props.comments.length} //This is important field to render the next data
                        next={() => { console.log("loadmore"); this.loadMoreComments() }}
                        style={{ overflow: "hidden", display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                        hasMore={this.props.hasMore}
                        inverse={true}
                        loader={<></>}
                        scrollableTarget={`scrollableComments${this.props.doc.id}`}
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>Yay! You have seen it all</b>
                            </p>
                        }
                    >
                        {(this.props.moreComments && this.props.moreComments.length > 0) &&
                            <>
                                {this.props.moreComments.map((commentId: number) => { return (<CommentDetailsComponent key={commentId} focus={commentId === this.state.focusId} docId={this.props.doc.id} login={this.props.login} commentId={commentId}></CommentDetailsComponent>); })}
                                <Divider className="divider-new-comments" orientation="right">New comments</Divider>
                            </>
                        }

                        {this.props.comments.map((commentId: number) => <CommentDetailsComponent key={commentId} focus={commentId === this.state.focusId} docId={this.props.doc.id} login={this.props.login} commentId={commentId}></CommentDetailsComponent>)}


                    </InfiniteScroll>
                }
                {
                    (this.props.moreComments || this.props.comments) &&
                    <>
                        <br /><br /><br />
                        <VisibilitySensor onChange={(visible: boolean) => {
                            if (visible) this.reportDocReadAndCleanFocusId();
                        }}>
                            <span>&nbsp;</span>
                        </VisibilitySensor>
                    </>
                }

            </>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: CommentsProps): DispatchProps => {
    return {
        reportDocRead: () => dispatch(reportDocRead(ownProps.doc.id)),
        loadComments: () => dispatch(requestCommentsToState(ownProps.doc.id))
    }
}

const mapStateToProps = (state: ApplicationState, props: CommentsProps): InjectableProps => {
    const mapOfComments = state.comments.docs.get(props.doc.id);
    return {
        loading: mapOfComments ? mapOfComments.loading : false,
        canPostComment: !!state.currentUser.user,
        moreComments: mapOfComments?.moreComments,
        comments: mapOfComments?.comments,
        hasMore: mapOfComments ? mapOfComments.hasMore : false
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentListComponent as any); 