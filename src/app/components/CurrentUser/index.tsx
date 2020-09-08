import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { User } from 'app/services/users';
import { requestCurrentUserData } from 'app/store/currentuser/actions';

interface LabelsPageState {
}

interface LabelsPageProps {
    currentUser: User | undefined | null;
}

interface DispatchProps {
    requestCurrentUser(): void;
}

interface AllProps extends LabelsPageProps, DispatchProps {

}

class CurrentUser extends React.Component<AllProps, LabelsPageState> {
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
                {this.props.currentUser !== undefined && (<>
                    {this.props.currentUser ?
                        (<span>{this.props.currentUser.displayName || this.props.currentUser.username} | <a href="/auth/logout">Logout</a></span>) :
                        (<a href="/auth/github">Login</a>)
                    }
                </>)}
            </>
        );
    };
}


const mapStateToProps = (state: ApplicationState): LabelsPageProps => {
    return {
        currentUser: state.currentUser.user
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestCurrentUser: () => dispatch(requestCurrentUserData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentUser as any); 