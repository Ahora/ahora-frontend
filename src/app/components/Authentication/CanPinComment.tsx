import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { User } from 'app/services/users';
import { Comment } from 'app/services/comments';
import { canPinComment } from 'app/services/authentication';
import { Doc } from 'app/services/docs';

interface Props {
    comment: Comment;
    doc: Doc;
}

interface CanCommentProps {
    currentUser: User | undefined | null;
}

interface AllProps extends CanCommentProps, Props {

}

class CanPingComment extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
    }

    render() {
        return (
            <>
                {canPinComment(this.props.doc, this.props.currentUser) && <>{this.props.children}</>}
            </>
        );
    };
}


const mapStateToProps = (state: ApplicationState): CanCommentProps => {
    return {
        currentUser: state.currentUser.user
    };
};

export default connect(mapStateToProps)(CanPingComment as any); 