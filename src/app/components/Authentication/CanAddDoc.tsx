import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { User } from 'app/services/users';
import { canAddDoc } from 'app/services/authentication';

interface CanAddDocProps {
    currentUser: User | undefined | null;
}

interface AllProps extends CanAddDocProps {
}

class CanAddDoc extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
    }

    render() {
        return (
            <>
                {canAddDoc(this.props.currentUser) && <>{this.props.children}</>}
            </>
        );
    };
}


const mapStateToProps = (state: ApplicationState): CanAddDocProps => {
    return {
        currentUser: state.currentUser.user
    };
};

export default connect(mapStateToProps)(CanAddDoc as any);