import * as React from 'react';
import { Comment, togglePinComment } from 'app/services/comments';
import Moment from 'react-moment';


interface CommentsProps {
    comment: Comment;
    login: string;
}

interface State {
    pinned: boolean;
}

export class CommentDetailsComponent extends React.Component<CommentsProps, State> {
    constructor(props: CommentsProps) {
        super(props);
        this.state = {
            pinned: props.comment.pinned
        }
    }

    async pinToggle() {
        this.setState({
            pinned: !this.state.pinned
        });
        try {
            await togglePinComment(this.props.login, this.props.comment, !this.state.pinned);
        } catch (error) {
            this.setState({
                pinned: this.state.pinned
            });
        }

    }

    render() {
        return (
            <div>
                <div>
                    <span onClick={this.pinToggle.bind(this)}>
                        {this.state.pinned ?
                            (<span className="fa fa-check" style={{ color: "green", float: "right" }}></span>) :
                            (<span style={{ float: "right" }} className="fa fa-check"></span>)}
                    </span>
                    <span className="font-weight-bold">{this.props.comment.user.username} | <Moment titleFormat="D MMM YYYY hh:mm" withTitle fromNow date={this.props.comment.createdAt}></Moment>:</span>
                </div>

                <p className="markdown-body" dangerouslySetInnerHTML={{ __html: this.props.comment.htmlComment }}></p>
            </ div>
        );
    }
}