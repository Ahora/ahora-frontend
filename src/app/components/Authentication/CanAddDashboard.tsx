import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { User } from 'app/services/users';
import { canAddDashboard } from 'app/services/authentication';

interface CanDashboardProps {
    currentUser: User | undefined | null;
}

interface AllProps extends CanDashboardProps {

}

class CanAddDashboard extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
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

export default connect(mapStateToProps)(CanAddDashboard as any);