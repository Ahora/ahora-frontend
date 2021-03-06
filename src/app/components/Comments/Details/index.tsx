import * as React from 'react';
import { Comment, updateComment, deleteComment, pinComment, unpinComment, CommentType } from 'app/services/comments';
import CanEditOrDeleteComment from 'app/components/Authentication/CanEditOrDeleteComment';
import CanPinComment from 'app/components/Authentication/CanPinComment';
import { Comment as CommentComponent } from 'antd';
import './style.scss';
import { CheckOutlined } from '@ant-design/icons';
import AhoraForm from 'app/components/Forms/AhoraForm/AhoraForm';
import AhoraField from 'app/components/Forms/AhoraForm/AhoraField';
import UserDetails from 'app/components/users/UserDetails';
import UserAvatar from 'app/components/users/UserAvatar';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import { Dispatch } from 'redux';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { deleteCommentInState, setQouteCommentInState, updateCommentInState } from 'app/store/comments/actions';
import AhoraDate from 'app/components/Basics/AhoraTime';
import { FormattedMessage } from 'react-intl';
import CommentFactory from './CommentFactory';

interface InjectableProps {
    comment?: Comment;
}

interface DispatchProps {
    updateComment: (comment: Comment) => void;
    deleteComment: (commentId: number) => void;
    qouteComment: (comment: Comment) => void;

}
interface CommentsProps extends InjectableProps, DispatchProps {
    commentId: number;
    docId: number;
    focus: boolean;
}



interface State {
    editMode: boolean;
    newCommentText?: string;
    submittingComment: boolean;
}

class CommentDetailsComponent extends React.Component<CommentsProps, State> {

    private containerRef: React.RefObject<HTMLDivElement>;

    constructor(props: CommentsProps) {
        super(props);
        this.state = {
            editMode: false,
            submittingComment: false
        }
        this.containerRef = React.createRef();
    }

    componentDidMount() {
        setTimeout(() => {
            if (this.props.focus && this.containerRef.current) {
                this.containerRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                });
            }
        }, 0);
    }

    editMode() {
        this.setState({
            editMode: true
        })
    }

    onCommentChange(text: string) {
        this.setState({
            newCommentText: text
        });
    }

    isDraft(): boolean {
        return this.props.comment ? this.props.comment.id < 0 : false;
    }

    async deleteCommentHandle() {
        if (this.props.comment && confirm("Are you sure you want to delete this?")) {
            await deleteComment(this.props.comment);
            this.props.deleteComment(this.props.comment.id);
        }
    }

    cancelEdit() {
        this.setState({
            newCommentText: undefined,
            submittingComment: false,
            editMode: false
        });
    }

    discard() {
        this.setState({
            editMode: false
        });
    }

    async post(data: any) {
        if (data.comment && this.props.comment) {
            this.setState({
                submittingComment: true
            });
            const newComment: Comment = await updateComment(this.props.comment.docId, this.props.comment.id, data.comment);
            this.props.updateComment(newComment);
            this.setState({
                newCommentText: undefined,
                submittingComment: false,
                editMode: false
            });
        }
    }

    onQoute(comment: Comment) {
        this.props.qouteComment(comment);

    }
    async pinToggle() {
        if (this.props.comment) {
            if (this.props.comment.pinned) {
                await unpinComment(this.props.comment);
            }
            else {
                await pinComment(this.props.comment);

            }

            this.props.updateComment({ ...this.props.comment, pinned: !this.props.comment.pinned });
        }
    }

    render() {
        if (this.props.comment) {
            return <div ref={this.containerRef} >
                <CommentComponent className="comment"
                    author={<UserDetails userId={this.props.comment.authorUserId}></UserDetails>}
                    avatar={
                        <>
                            {this.props.comment.pinned && <span className="pinned"><CheckOutlined /></span>}
                            <UserAvatar userId={this.props.comment.authorUserId}></UserAvatar>
                        </>
                    }
                    datetime={<AhoraDate date={this.props.comment.createdAt}></AhoraDate>}
                    actions={(this.isDraft() || this.props.comment.commentType !== CommentType.comment) ? undefined : [ //Don't show actions if comment is not created yet in the server
                        <span key="comment-basic-reply-to" onClick={this.onQoute.bind(this, this.props.comment)}><FormattedMessage id="quoteComment" /></span>,
                        <CanEditOrDeleteComment comment={this.props.comment}>
                            <span onClick={this.editMode.bind(this)}><FormattedMessage id="editComment" /></span>
                            <span onClick={this.deleteCommentHandle.bind(this)}><FormattedMessage id="deleteComment" /></span>
                        </CanEditOrDeleteComment>,
                        <CanPinComment docId={this.props.docId} comment={this.props.comment}>
                            <span onClick={this.pinToggle.bind(this)}>{this.props.comment.pinned ? <FormattedMessage id="unpinComment" /> : <FormattedMessage id="pinComment" />}</span>
                        </CanPinComment>
                    ]}
                    content={
                        this.state.editMode ?
                            <AhoraForm submitButtonText={<FormattedMessage id="updateCommentButtonText" />} data={{ comment: this.props.comment.comment }} onCancel={this.discard.bind(this)} onSumbit={this.post.bind(this)}>
                                <AhoraField fieldType="markdown" fieldName="comment" displayName=""></AhoraField>
                            </AhoraForm>
                            :
                            <CommentFactory comment={this.props.comment} />
                    }>

                </CommentComponent>
            </div>;
        }
        else {
            return <AhoraSpinner />
        }
    }

}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: CommentsProps): DispatchProps => {
    return {
        qouteComment: (comment: Comment) => dispatch(setQouteCommentInState(comment)),
        deleteComment: (commentId: number) => dispatch(deleteCommentInState(ownProps.docId, commentId)),
        updateComment: (comment: Comment) => dispatch(updateCommentInState(ownProps.docId, comment))
    }
}

const mapStateToProps = (state: ApplicationState, props: CommentsProps): InjectableProps => {
    const mapOfComments = state.comments.docs.get(props.docId);

    return {
        comment: mapOfComments?.map.get(props.commentId)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentDetailsComponent as any); 