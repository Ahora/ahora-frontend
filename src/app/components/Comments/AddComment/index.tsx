import * as React from 'react';
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { addComment, Comment } from 'app/services/comments';
import MarkDownEditor from 'app/components/MarkDownEditor';
import Nav from 'react-bootstrap/Nav';


interface CommentsProps {
    docId: number;
    login: string;
    qouteComment?: Comment;
    commentAdded: (comment: Comment) => void;
}

interface State {
    comment?: string;
    submittingComment: boolean;
}

export class AddCommentComponent extends React.Component<CommentsProps, State> {

    constructor(props: CommentsProps) {
        super(props);

        this.state = {
            comment: "",
            submittingComment: false
        }
    }

    componentDidUpdate(prevProps: CommentsProps) {
        if (prevProps.qouteComment !== this.props.qouteComment && this.props.qouteComment) {
            const commentRows = this.props.qouteComment.comment.split("\n");
            for (let index = 0; index < commentRows.length; index++) {
                commentRows[index] = ">" + commentRows[index];
            }

            this.setState({
                comment: commentRows.join("\n") + "\n\n"
            });
        }
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
                    submittingComment: false
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


    render() {
        const disablePost: boolean = !(!!this.state.comment && this.state.comment.trim().length > 0);
        return (
            <div>
                <MarkDownEditor value={this.state.comment} onChange={this.handleChange.bind(this)} />
                <Nav className="justify-content-end mt-2">
                    <Button variant="success" disabled={disablePost} onClick={this.post()}>
                        {this.state.submittingComment ?
                            <Spinner animation="border" /> :
                            <>Comment</>
                        }
                    </Button>
                </Nav>
            </div>
        );
    }
}

