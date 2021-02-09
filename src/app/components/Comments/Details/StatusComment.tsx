import DocStatusText from "app/components/localization/DocStatusText"
import UserDetails from "app/components/users/UserDetails"
import { Comment } from "app/services/comments"
import React from "react"
import { FormattedMessage } from "react-intl"

interface Props {
    comment: Comment
}

export default function StatusComment(props: Props) {
    return <p>

        <FormattedMessage id="statusCommentContent" values={{
            author: <UserDetails hideDisplayName={true} userId={props.comment.authorUserId}></UserDetails>,
            status: <strong>{props.comment.oldValue ? <DocStatusText statusId={props.comment.oldValue} /> : <>None</>} </strong>,
            prevStatus: <strong>{props.comment.newValue ? <DocStatusText statusId={props.comment.newValue} /> : <>None</>} </strong>
        }}></FormattedMessage>
    </p>
}