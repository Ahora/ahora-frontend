import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { User } from 'app/services/users';
import { requestCurrentUserData } from 'app/store/currentuser/actions';
import { Doc } from 'app/services/docs';
import { canEditDoc } from 'app/services/authentication';

interface CanEditProps {
    currentUser: User | undefined | null;
}

interface DispatchProps {
    requestCurrentUser(): void;
}

interface AllProps extends CanEditProps, DispatchProps {
    doc: Doc
}

class CanEdit extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            addNewLabel: false
        };
    }

    async componentDidMount() {
        this.props.requestCurrentUser();
    }

    render() {
        return (
            <>
                {canEditDoc(this.props.currentUser, this.props.doc) && <>{this.props.children}</>}
            </>
        );
    };
}


const mapStateToProps = (state: ApplicationState): CanEditProps => {
    return {
        currentUser: state.currentUser.user
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestCurrentUser: () => dispatch(requestCurrentUserData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CanEdit as any); 