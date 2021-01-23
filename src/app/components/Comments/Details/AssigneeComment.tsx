import UserDetails from "app/components/users/UserDetails"
import { Comment } from "app/services/comments"
import React from "react"
import { FormattedMessage } from "react-intl"

interface Props {
    comment: Comment
}

export default function AssigneeComment(props: Props) {
    return <p>
        <FormattedMessage id="assigneeCommentContent" values={{
            author: <UserDetails hideDisplayName={true} userId={props.comment.authorUserId}></UserDetails>,
            oldUser: <strong>{props.comment.oldValue ? <UserDetails hideDisplayName={true} userId={props.comment.oldValue} /> : <>Unassigned</>} </strong>,
            user: <strong>{props.comment.oldValue ? <UserDetails hideDisplayName={true} userId={props.comment.newValue} /> : <>Unassigned</>} </strong>
        }}></FormattedMessage>
    </p>
}