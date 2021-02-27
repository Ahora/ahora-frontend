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
import { markdownToHTML } from 'app/sdk/markdown';
import AhoraHotKey from 'app/components/Basics/AhoraHotKey';
require("./style.scss")


interface InjectableProps {
    currentUser: User | undefined | null;
    qouteComment?: Comment;

}
interface CommentsProps extends InjectableProps {
    docId: number;
    login: string;
    commentAdded: (comment: Comment) => void;
}

interface State {
    comment: string;
    rawComment?: string;
    submittingComment: boolean;
}

class AddCommentComponent extends React.Component<CommentsProps, State> {
    private markdownRef: React.RefObject<any>;
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

    private quouteText(comment: string): string {
        const commentRows = comment.split("\n");
        for (let index = 0; index < commentRows.length; index++) {
            commentRows[index] = ">" + commentRows[index];
        }

        return commentRows.join("\n") + "\n\n";
    }

    focus() {
        console.log(this.markdownRef);

        if (this.markdownRef.current) {
            this.markdownRef.current.focus();
        }
    }

    componentDidUpdate(prevProps: CommentsProps) {
        if (prevProps.qouteComment !== this.props.qouteComment && this.props.qouteComment && this.props.qouteComment.comment !== this.state.rawComment) {

            this.setState({
                rawComment: this.quouteText(this.props.qouteComment.comment)
            });

            this.focus();
        }
        else if (prevProps.qouteComment !== this.props.qouteComment) {
            if (this.props.qouteComment) {
                this.setState({
                    rawComment: this.quouteText(this.props.qouteComment.comment)
                });
            }
            else {
                this.setState({ rawComment: undefined });
            }
        }
    }

    async post(): Promise<void> {
        if (this.state.rawComment) {
            this.setState({
                submittingComment: true
            });
            this.focus();
            const tempcomment: Comment = {
                id: this.tempId--,
                authorUserId: this.props.currentUser!.id,
                createdAt: new Date(),
                pinned: false,
                parentId: this.props.qouteComment && this.props.qouteComment.id,
                comment: this.state.rawComment,
                htmlComment: await markdownToHTML(this.state.rawComment),
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

    onPressEnter(event: KeyboardEvent<HTMLDivElement>) {
        if (!event.shiftKey && !event.ctrlKey && event.key === "Enter") {
            event.stopPropagation();
            event.preventDefault();
            this.post();
        }
    }

    render() {
        return (
            <div className="mt-2 add-comment-container">
                <AhoraMarkdownField onPressEnter={this.onPressEnter.bind(this)} ref={this.markdownRef} autoFocus={true} onChange={this.handleChange.bind(this)} value={this.state.rawComment} fieldData={{ displayName: "", fieldName: "comment", fieldType: "markdown" }}></AhoraMarkdownField>
                <div className="buttons">
                    <Button onClick={this.post.bind(this)} size="small" disabled={this.state.rawComment === undefined || this.state.rawComment.length === 0} type="primary">
                        {this.state.submittingComment ? <AhoraSpinner /> : <SendOutlined />}
                    </Button>
                </div>
                <AhoraHotKey shortcut="alt+c" action={() => this.focus()}></AhoraHotKey>
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState, ownProps: CommentsProps): InjectableProps => {
    return {
        qouteComment: state.comments.docs.get(ownProps.docId)?.qouteComment,
        currentUser: state.currentUser.user
    };
};

export default connect(mapStateToProps)(AddCommentComponent as any); 