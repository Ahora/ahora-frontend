import * as React from 'react';
import { Comment } from 'app/services/comments';
import Moment from 'react-moment';


interface CommentsProps {
    comment: Comment;
}

interface State {
}

export class CommentDetailsComponent extends React.Component<CommentsProps, State> {
    constructor(props: CommentsProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="font-weight-bold">{this.props.comment.userAlias} | <Moment titleFormat="D MMM YYYY hh:mm" withTitle fromNow date={this.props.comment.createdAt}></Moment>:</div>
                <p className="markdown-body" dangerouslySetInnerHTML={{ __html: this.props.comment.htmlComment }}></p>
            </ div>
        );
    }
}