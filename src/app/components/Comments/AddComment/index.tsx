import * as React from 'react';
import { addComment, Comment } from 'app/services/comments';
import { SendOutlined } from '@ant-design/icons';
import AhoraMarkdownField from 'app/components/Forms/Fields/AhoraMarkdownField';
import { Button } from 'antd';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
require("./style.scss")

interface CommentsProps {
    docId: number;
    login: string;
    qouteComment?: Comment;
    commentAdded: (comment: Comment) => void;
}

interface State {
    comment?: string;
    rawComment?: string;
    submittingComment: boolean;
}

export class AddCommentComponent extends React.Component<CommentsProps, State> {
    private markdownRef: React.RefObject<AhoraMarkdownField>;

    constructor(props: CommentsProps) {
        super(props);

        this.state = {
            comment: "",
            submittingComment: false
        }

        this.markdownRef = React.createRef();
    }

    componentDidUpdate(prevProps: CommentsProps) {
        if (prevProps.qouteComment !== this.props.qouteComment && this.props.qouteComment) {
            const commentRows = this.props.qouteComment.comment.split("\n");
            for (let index = 0; index < commentRows.length; index++) {
                commentRows[index] = ">" + commentRows[index];
            }

            this.setState({
                comment: commentRows.join("\n") + "\n\n",
            });
        }
    }

    async post(): Promise<void> {
        if (this.state.rawComment) {
            this.setState({
                submittingComment: true
            });
            if (this.markdownRef.current) {
                this.markdownRef.current.focus();
            }
            const newComment: Comment = await addComment(this.props.login, this.props.docId, this.state.rawComment, this.props.qouteComment && this.props.qouteComment.id);
            this.setState({
                comment: "",
                rawComment: "",
                submittingComment: false,
            });
            this.props.commentAdded(newComment);
        }
    }

    handleChange(text: string) {
        this.setState({
            rawComment: text
        });
    }

    render() {
        return (
            <>
                <div className="add-comment-space"></div>
                <div className="mt-2 add-comment-container">
                    <AhoraMarkdownField ref={this.markdownRef} autoFocus={true} onChange={this.handleChange.bind(this)} value={this.state.rawComment} fieldData={{ displayName: "", fieldName: "comment", fieldType: "markdown" }}></AhoraMarkdownField>
                    <div className="buttons">
                        <Button onClick={this.post.bind(this)} size="small" disabled={this.state.rawComment === undefined || this.state.rawComment.length === 0} type="primary">
                            {this.state.submittingComment ? <AhoraSpinner /> : <SendOutlined />}
                        </Button>
                    </div>
                </div>
            </>
        );
    }
}

