import * as React from 'react';
import { Comment, updateComment, deleteComment, pinComment, unpinComment } from 'app/services/comments';
import Moment from 'react-moment';
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import './style.scss';
import MarkDownEditor from 'app/components/MarkDownEditor';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import CanEditOrDeleteComment from 'app/components/Authentication/CanEditOrDeleteComment';
import CanPinComment from 'app/components/Authentication/CanPinComment';
import { Doc } from 'app/services/docs';

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
        return (
            <Card className="mb-2">
                <Card.Header>
                    <div className="commentTitle">
                        <span className="authoranddate font-weight-bold">
                            {this.state.pinned &&
                                <span className="pinned">
                                    <span className="fa fa-check"></span>
                                </span>
                            }
                            {this.props.comment.author.username} | <Moment titleFormat="D MMM YYYY hh:mm" withTitle fromNow format="D MMM YYYY hh:mm" date={this.props.comment.createdAt}></Moment>
                        </span>
                        <div className="justifyend">
                            <DropdownButton alignRight title="" size="sm" variant="light" as={ButtonGroup} id="bg-nested-dropdown">
                                <CanEditOrDeleteComment comment={this.props.comment}>
                                    <Dropdown.Item eventKey="1" onClick={this.editMode.bind(this)}>Edit</Dropdown.Item>
                                    <Dropdown.Item eventKey="2" onClick={this.deleteCommentHandle.bind(this)}>Delete</Dropdown.Item>
                                </CanEditOrDeleteComment>
                                <CanPinComment doc={this.props.doc} comment={this.props.comment}>
                                    <Dropdown.Item eventKey="3" onClick={this.pinToggle.bind(this)}>{this.state.pinned ? "Unpin Comment" : "Pin Comment"}</Dropdown.Item>
                                </CanPinComment>
                                <Dropdown.Item eventKey="4" onClick={this.props.onQoute.bind(this, this.props.comment)}>Quote comment</Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    {this.state.editMode ?
                        <div>
                            <MarkDownEditor value={this.props.comment.comment} onChange={this.onCommentChange.bind(this)}></MarkDownEditor>
                            <Nav className="justify-content-end mt-2">
                                <Button variant="success" disabled={disablePost || this.state.submittingComment} onClick={this.post.bind(this)}>
                                    {this.state.submittingComment ? <Spinner animation="border" /> : <>Update Comment</>}
                                </Button>
                                <Button variant="danger" onClick={this.cancelEdit.bind(this)}>Cancel</Button>
                            </Nav>
                        </div> :
                        <p className="markdown-body" dangerouslySetInnerHTML={{ __html: this.state.comment.htmlComment }}></p>
                    }
                </Card.Body>
            </Card>
        );
    }
}