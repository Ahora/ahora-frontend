import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { User } from 'app/services/users';
import { Comment } from 'app/services/comments';
import { requestCurrentUserData } from 'app/store/currentuser/actions';
import { canPinComment } from 'app/services/authentication';
import { Doc } from 'app/services/docs';

interface Props {
    comment: Comment;
    doc: Doc;
}

interface CanCommentProps {
    currentUser: User | undefined | null;
}

interface DispatchProps {
    requestCurrentUser(): void;
}

interface AllProps extends CanCommentProps, DispatchProps, Props {

}

class CanPingComment extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
    }

    async componentDidMount() {
        this.props.requestCurrentUser();
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

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestCurrentUser: () => dispatch(requestCurrentUserData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CanPingComment as any); 