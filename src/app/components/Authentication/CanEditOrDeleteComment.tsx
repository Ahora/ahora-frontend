import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { User } from 'app/services/users';
import { Comment } from 'app/services/comments';
import { requestCurrentUserData } from 'app/store/currentuser/actions';
import { canEditOrDeleteComment } from 'app/services/authentication';

interface Props {
    comment: Comment;
}

interface CanCommentProps {
    currentUser: User | undefined | null;
}

interface DispatchProps {
    requestCurrentUser(): void;
}

interface AllProps extends CanCommentProps, DispatchProps, Props {

}

class CanEditOrDeleteComment extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
    }

    async componentDidMount() {
        this.props.requestCurrentUser();
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

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestCurrentUser: () => dispatch(requestCurrentUserData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CanEditOrDeleteComment as any); 