import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { User } from 'app/services/users';
import { requestCurrentUserData } from 'app/store/currentuser/actions';
import { canComment } from 'app/services/authentication';

interface CanCommentProps {
    currentUser: User | undefined | null;
}

interface DispatchProps {
    requestCurrentUser(): void;
}

interface AllProps extends CanCommentProps, DispatchProps {

}

class CanCommnet extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
    }

    async componentDidMount() {
        this.props.requestCurrentUser();
    }

    render() {
        return (
            <>
                {canComment(this.props.currentUser) && <>{this.props.children}</>}
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

export default connect(mapStateToProps, mapDispatchToProps)(CanCommnet as any); 