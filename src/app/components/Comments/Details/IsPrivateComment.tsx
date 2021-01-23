import UserDetails from "app/components/users/UserDetails"
import { Comment } from "app/services/comments"
import React from "react"
import { FormattedMessage } from "react-intl"

interface Props {
    comment: Comment
}

export default function IsPrivateComment(props: Props) {
    return <p>
        <FormattedMessage id={`isPrivateComment${props.comment.newValue ? "private" : "public"}`} values={{
            author: <UserDetails hideDisplayName={true} userId={props.comment.authorUserId}></UserDetails>,
        }}></FormattedMessage>
    </p>
}