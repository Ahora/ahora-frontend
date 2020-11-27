import * as React from 'react';
import { Comment } from 'app/services/comments';
import { SendOutlined } from '@ant-design/icons';
import AhoraMarkdownField from 'app/components/Forms/Fields/AhoraMarkdownField';
import { Button } from 'antd';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import { ApplicationState } from 'app/store';
import { User } from 'app/services/users';
import { connect } from 'react-redux';
import { KeyboardEvent } from 'react';
require("./style.scss")


interface InjectableProps {
    currentUser: User | undefined | null;

}
interface CommentsProps extends InjectableProps {
    docId: number;
    login: string;
    qouteComment?: Comment;
    commentAdded: (comment: Comment) => void;
}

interface State {
    comment: string;
    rawComment?: string;
    submittingComment: boolean;
}

class AddCommentComponent extends React.Component<CommentsProps, State> {
    private markdownRef: React.RefObject<AhoraMarkdownField>;
    private tempId: number;

    constructor(props: CommentsProps) {
        super(props);

        this.tempId = -1;

        this.state = {
            comment: "",
            submittingComment: false
        }

        this.markdownRef = React.createRef();
    }

    componentDidUpdate(prevProps: CommentsProps) {
        if (prevProps.qouteComment !== this.props.qouteComment && this.props.qouteComment && this.props.qouteComment.comment !== this.state.rawComment) {
            const commentRows = this.props.qouteComment.comment.split("\n");
            for (let index = 0; index < commentRows.length; index++) {
                commentRows[index] = ">" + commentRows[index];
            }

            this.setState({
                rawComment: commentRows.join("\n") + "\n\n",
            });

            if (this.markdownRef.current) {
                this.markdownRef.current.focus();
            }
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

            const tempcomment: Comment = {
                id: this.tempId--,
                authorUserId: this.props.currentUser!.id,
                createdAt: new Date(),
                pinned: false,
                parentId: this.props.qouteComment && this.props.qouteComment.id,
                comment: this.state.rawComment,
                htmlComment: this.state.rawComment,
                docId: this.props.docId,
                updatedAt: new Date()
            };

            this.props.commentAdded(tempcomment);

            this.setState({
                comment: "",
                rawComment: "",
                submittingComment: false,
            });
        }
    }

    handleChange(text: string) {
        this.setState({
            rawComment: text
        });
    }

    onkeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (!event.shiftKey && !event.ctrlKey && event.key === "Enter") {
            event.stopPropagation();
            event.preventDefault();
            this.post();
        }
    }

    render() {
        return (
            <>
                <div onKeyDown={this.onkeyDown.bind(this)} className="mt-2 add-comment-container">
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

const mapStateToProps = (state: ApplicationState): InjectableProps => {
    return {
        currentUser: state.currentUser.user
    };
};

export default connect(mapStateToProps)(AddCommentComponent as any); 