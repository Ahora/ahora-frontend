import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { User } from 'app/services/users';
import { canComment } from 'app/services/authentication';

interface CanCommentProps {
    currentUser: User | undefined | null;
}

interface AllProps extends CanCommentProps {

}

class CanCommnet extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
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


export default connect(mapStateToProps)(CanCommnet as any);