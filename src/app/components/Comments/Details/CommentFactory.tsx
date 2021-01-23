import { Comment, CommentType } from "app/services/comments"
import React from "react";
import AssigneeComment from "./AssigneeComment";
import IsPrivateComment from "./IsPrivateComment";
import StatusComment from "./StatusComment";

interface Props {
    comment: Comment
}

export default function CommentFactory(props: Props) {
    switch (props.comment.commentType) {
        case CommentType.statusChanged:
            return <StatusComment comment={props.comment} />
        case CommentType.assigneeChanged:
            return <AssigneeComment comment={props.comment} />
        case CommentType.isPrivateChanged:
            return <IsPrivateComment comment={props.comment} />
        default:
            return <p className="markdown-body" dangerouslySetInnerHTML={{ __html: props.comment.htmlComment }}></p>
    }
}