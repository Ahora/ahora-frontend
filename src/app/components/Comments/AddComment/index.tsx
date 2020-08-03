import * as React from 'react';
import { addComment, Comment } from 'app/services/comments';
import AhoraForm from 'app/components/Forms/AhoraForm/AhoraForm';
import AhoraField from 'app/components/Forms/AhoraForm/AhoraField';
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

    async post(data: any): Promise<void> {
        if (data.comment) {
            this.setState({
                submittingComment: true
            });
            const newComment: Comment = await addComment(this.props.login, this.props.docId, data.comment, this.props.qouteComment && this.props.qouteComment.id);
            this.setState({
                comment: undefined,
                submittingComment: false,
                editMode: false
            });
            this.props.commentAdded(newComment)
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
        return (
            <div className="mt-2">
                {
                    this.state.editMode ?
                        <>
                            <AhoraForm submitButtonText="Post" data={{ comment: this.state.comment }} onCancel={this.discard.bind(this)} onSumbit={this.post.bind(this)}>
                                <AhoraField fieldType="markdown" fieldName="comment" displayName=""></AhoraField>
                            </AhoraForm>
                        </> :
                        <div className="AddCommentPlaceHolder" onClick={this.editMode.bind(this)}>Add a comment</div>
                }
            </div>
        );
    }
}

