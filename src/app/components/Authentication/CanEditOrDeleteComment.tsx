import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { User } from 'app/services/users';
import { Comment } from 'app/services/comments';
import { canEditOrDeleteComment } from 'app/services/authentication';

interface Props {
    comment: Comment;
}

interface CanCommentProps {
    currentUser: User | undefined | null;
}


interface AllProps extends CanCommentProps, Props {

}

class CanEditOrDeleteComment extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
    }

    render() {
        return (
            <>
                {canEditOrDeleteComment(this.props.comment, this.props.currentUser) && <>{this.props.children}</>}
            </>
        );
    };
}


const mapStateToProps = (state: ApplicationState): CanCommentProps => {
    return {
        currentUser: state.currentUser.user
    };
};

export default connect(mapStateToProps)(CanEditOrDeleteComment as any); 