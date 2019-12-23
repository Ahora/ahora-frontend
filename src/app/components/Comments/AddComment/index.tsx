import * as React from 'react';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { addComment, Comment } from 'app/services/comments';


interface CommentsProps {
    docId: number;
    login: string;
    commentAdded: (comment: Comment) => void;
}

interface State {
    comment?: string;
    submittingComment: boolean;
}

export class AddCommentComponent extends React.Component<CommentsProps, State> {

    private textInput?: any;
    constructor(props: CommentsProps) {
        super(props);

        this.textInput = React.createRef();
        this.state = {
            submittingComment: false
        }
    }

    post() {
        return async () => {
            if (this.state.comment) {
                this.setState({
                    submittingComment: true
                });
                const newComment: Comment = await addComment(this.props.login, this.props.docId, this.state.comment);
                this.textInput.current.value = "";
                this.setState({
                    comment: undefined,
                    submittingComment: false
                });
                this.props.commentAdded(newComment)
            }
        }
    }

    handleChange() {
        return () => {
            this.setState({
                comment: this.textInput.current.value
            });
        }
    }


    render() {
        const disablePost: boolean = !(!!this.state.comment && this.state.comment.trim().length > 0);
        return (
            <div>
                <InputGroup className="mb-3">
                    <FormControl as="textarea" placeholder="Add a comment" ref={this.textInput} onChange={this.handleChange()} />
                    <InputGroup.Append>
                        <Button variant="primary" disabled={disablePost} onClick={this.post()}>
                            {this.state.submittingComment ?
                                <Spinner animation="border" /> :
                                <>
                                    Post
                                </>
                            }
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
            </div>
        );
    }
}

