import * as React from 'react';
import { UserItem } from 'app/services/users';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { requestUserInfo } from 'app/store/users/actions';

interface InjectableProps {
    user?: UserItem;
}

interface UserDetailsProps extends InjectableProps, DispatchProps {
    userId?: number;
    hideDisplayName?: boolean;
}

interface DispatchProps {
    requestUserInfo(userId: number): void;
}

class UserDetails extends React.Component<UserDetailsProps> {

    componentDidMount() {
        if (this.props.userId && !this.props.user) {
            this.props.requestUserInfo(this.props.userId);
        }
    }

    render() {
        const userInfo = this.props.user;
        return <>{userInfo && <>{userInfo.username}{(this.props.hideDisplayName !== true && userInfo.displayName) && <> ({userInfo.displayName})</>}</>}</>
    }
}


const mapStateToProps = (state: ApplicationState, props: UserDetailsProps): InjectableProps => {
    const user = props.user || (props.userId !== undefined ? state.users.map.get(props.userId) : undefined);
    return { user };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestUserInfo: (userId) => dispatch(requestUserInfo(userId))
    }
}

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(UserDetails as any)