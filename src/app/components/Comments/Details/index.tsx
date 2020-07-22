import * as React from 'react';
import { Comment, updateComment, deleteComment, pinComment, unpinComment } from 'app/services/comments';
import Moment from 'react-moment';
import MarkDownEditor from 'app/components/MarkDownEditor';
import Nav from 'react-bootstrap/Nav';
import CanEditOrDeleteComment from 'app/components/Authentication/CanEditOrDeleteComment';
import CanPinComment from 'app/components/Authentication/CanPinComment';
import { Doc } from 'app/services/docs';
import { Comment as CommentComponent, Button } from 'antd';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import './style.scss';
import { CheckOutlined } from '@ant-design/icons';

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

    async post() {
        if (this.state.comment) {
            this.setState({
                submittingComment: true
            });
            const newComment: Comment = await updateComment(this.props.login, this.state.comment.docId, this.state.comment.id, this.state.newCommentText!);
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
        const disablePost: boolean = !(!!this.state.newCommentText && this.state.newCommentText.trim().length > 0);
        return <CommentComponent className="comment"
            author={
                <>
                    {this.state.pinned && <span className="pinned"><CheckOutlined /></span>}
                    {this.props.comment.author.username}
                </>
            }
            datetime={<Moment titleFormat="D MMM YYYY hh:mm" withTitle fromNow format="D MMM YYYY hh:mm" date={this.props.comment.createdAt}></Moment>}
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
                    <div>
                        <MarkDownEditor value={this.props.comment.comment} onChange={this.onCommentChange.bind(this)}></MarkDownEditor>
                        <Nav className="justify-content-end button-container">
                            <Button type="default" onClick={this.discard.bind(this)}>Discard</Button>
                            <Button type="primary" disabled={disablePost} onClick={this.post.bind(this)}>
                                {this.state.submittingComment ?
                                    <AhoraSpinner /> :
                                    <>Update</>
                                }
                            </Button>
                        </Nav>
                    </div> :
                    <p className="markdown-body" dangerouslySetInnerHTML={{ __html: this.state.comment.htmlComment }}></p>
            }>

        </CommentComponent>;
    }

}