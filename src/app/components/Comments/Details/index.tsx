import * as React from 'react';
import { Comment, updateComment, deleteComment, pinComment, unpinComment } from 'app/services/comments';
import Moment from 'react-moment';
import CanEditOrDeleteComment from 'app/components/Authentication/CanEditOrDeleteComment';
import CanPinComment from 'app/components/Authentication/CanPinComment';
import { Doc } from 'app/services/docs';
import { Comment as CommentComponent } from 'antd';
import './style.scss';
import { CheckOutlined } from '@ant-design/icons';
import AhoraForm from 'app/components/Forms/AhoraForm/AhoraForm';
import AhoraField from 'app/components/Forms/AhoraForm/AhoraField';

interface CommentsProps {
    comment: Comment;
    login: string;
    doc: Doc;
    onDelete(id: number): void;
    onQoute(comment: Comment): void;
}

interface State {
    pinned: boolean;
    editMode: boolean;
    comment: Comment;
    newCommentText?: string;
    submittingComment: boolean;
}

export class CommentDetailsComponent extends React.Component<CommentsProps, State> {
    constructor(props: CommentsProps) {
        super(props);
        this.state = {
            pinned: props.comment.pinned,
            comment: this.props.comment,
            editMode: false,
            submittingComment: false
        }
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

    async deleteCommentHandle() {
        if (confirm("Are you sure you want to delete this?")) {
            await deleteComment(this.props.login, this.state.comment);
            this.props.onDelete(this.state.comment.id);
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
        if (data.comment) {
            this.setState({
                submittingComment: true
            });
            const newComment: Comment = await updateComment(this.props.login, this.state.comment.docId, this.state.comment.id, data.comment);
            this.setState({
                comment: newComment,
                newCommentText: undefined,
                submittingComment: false,
                editMode: false
            });
        }
    }
    async pinToggle() {
        if (this.state.pinned) {
            await unpinComment(this.props.login, this.props.comment);
        }
        else {
            await pinComment(this.props.login, this.props.comment);

        }
        this.setState({
            pinned: !this.state.pinned
        });
    }

    render() {
        return <CommentComponent className="comment"
            author={
                <>
                    {this.state.pinned && <span className="pinned"><CheckOutlined /></span>}
                    {this.props.comment.author.username}
                </>
            }
            datetime={<Moment titleFormat="YYYY-MM-DD HH:mm" withTitle fromNow format="YYYY-MM-DD HH:mm" date={this.props.comment.createdAt}></Moment>}
            actions={[
                <span key="comment-basic-reply-to" onClick={this.props.onQoute.bind(this, this.props.comment)}>Quote</span>,
                <CanEditOrDeleteComment comment={this.props.comment}>
                    <span onClick={this.editMode.bind(this)}>Edit</span>
                    <span onClick={this.deleteCommentHandle.bind(this)}>Delete</span>
                </CanEditOrDeleteComment>,
                <CanPinComment doc={this.props.doc} comment={this.props.comment}>
                    <span onClick={this.pinToggle.bind(this)}>{this.state.pinned ? "Unpin" : "Pin"}</span>
                </CanPinComment>
            ]}
            content={
                this.state.editMode ?
                    <AhoraForm submitButtonText="Update" data={{ comment: this.state.comment.comment }} onCancel={this.discard.bind(this)} onSumbit={this.post.bind(this)}>
                        <AhoraField fieldType="markdown" fieldName="comment" displayName=""></AhoraField>
                    </AhoraForm>
                    :
                    <p className="markdown-body" dangerouslySetInnerHTML={{ __html: this.state.comment.htmlComment }}></p>
            }>

        </CommentComponent>;
    }

}