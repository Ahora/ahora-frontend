import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { User } from 'app/services/users';
import { requestCurrentUserData } from 'app/store/currentuser/actions';
import { canAddDashboard } from 'app/services/authentication';

interface CanDashboardProps {
    currentUser: User | undefined | null;
}

interface DispatchProps {
    requestCurrentUser(): void;
}

interface AllProps extends CanDashboardProps, DispatchProps {

}

class CanAddDashboard extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
    }

    async componentDidMount() {
        this.props.requestCurrentUser();
    }

    render() {
        return (
            <>
                {canAddDashboard(this.props.currentUser) && <>{this.props.children}</>}
            </>
        );
    };
}


const mapStateToProps = (state: ApplicationState): CanDashboardProps => {
    return {
        currentUser: state.currentUser.user
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestCurrentUser: () => dispatch(requestCurrentUserData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CanAddDashboard as any); 