import * as React from 'react';
import { addComment, Comment } from 'app/services/comments';
import MarkDownEditor from 'app/components/MarkDownEditor';
import Nav from 'react-bootstrap/Nav';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import { Button } from 'antd';
require("./style.scss")


interface CommentsProps {
    docId: number;
    login: string;
    qouteComment?: Comment;
    commentAdded: (comment: Comment) => void;
}

interface State {
    comment?: string;
    editMode: boolean;
    submittingComment: boolean;
}

export class AddCommentComponent extends React.Component<CommentsProps, State> {

    constructor(props: CommentsProps) {
        super(props);

        this.state = {
            comment: "",
            submittingComment: false,
            editMode: false
        }
    }

    componentDidUpdate(prevProps: CommentsProps) {
        if (prevProps.qouteComment !== this.props.qouteComment && this.props.qouteComment) {
            const commentRows = this.props.qouteComment.comment.split("\n");
            for (let index = 0; index < commentRows.length; index++) {
                commentRows[index] = ">" + commentRows[index];
            }

            this.setState({
                comment: commentRows.join("\n") + "\n\n",
                editMode: true
            });
        }
    }

    discard() {
        this.setState({
            editMode: false
        });
    }

    post() {
        return async () => {
            if (this.state.comment) {
                this.setState({
                    submittingComment: true
                });
                const newComment: Comment = await addComment(this.props.login, this.props.docId, this.state.comment, this.props.qouteComment && this.props.qouteComment.id);
                this.setState({
                    comment: undefined,
                    submittingComment: false,
                    editMode: false
                });
                this.props.commentAdded(newComment)
            }
        }
    }

    handleChange(text: string) {
        this.setState({
            comment: text
        });
    }

    editMode() {
        this.setState({
            editMode: true
        });
    }


    render() {
        const disablePost: boolean = !(!!this.state.comment && this.state.comment.trim().length > 0);
        return (
            <div className="mt-2">
                {
                    this.state.editMode ?
                        <>
                            <MarkDownEditor value={this.state.comment} onChange={this.handleChange.bind(this)} />
                            <Nav className="justify-content-end button-container">
                                <Button type="default" onClick={this.discard.bind(this)}>Discard</Button>
                                <Button type="primary" disabled={disablePost} onClick={this.post()}>
                                    {this.state.submittingComment ?
                                        <AhoraSpinner /> :
                                        <>Post</>
                                    }
                                </Button>
                            </Nav>
                        </> :
                        <div className="AddCommentPlaceHolder" onClick={this.editMode.bind(this)}>Add a comment</div>
                }
            </div>
        );
    }
}

