import { Avatar, Tooltip } from 'antd';
import AhoraSpinner from '../Forms/Basics/Spinner';
import * as React from 'react';
import { UserItem } from 'app/services/users';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { requestUserInfo } from 'app/store/users/actions';
import UserDetails from './UserDetails';

interface InjectableProps {
    user?: UserItem;
}

interface UserAvatarProps extends InjectableProps, DispatchProps {
    userId: number;
}

interface DispatchProps {
    requestUserInfo(userId: number): void;
}

class UserAvatar extends React.Component<UserAvatarProps> {

    componentDidMount() {
        if (this.props.userId && !this.props.user) {
            this.props.requestUserInfo(this.props.userId);
        }
    }

    render() {
        if (this.props.user) {
            return <Tooltip title={<UserDetails user={this.props.user} />}>
                <Avatar src={`https://github.com/${this.props.user.username}.png?size=32`}></Avatar>
            </Tooltip>
        } else {
            return <AhoraSpinner />
        }
    }
}


const mapStateToProps = (state: ApplicationState, props: UserAvatarProps): InjectableProps => {
    const user = props.user || state.users.map.get(props.userId);
    return { user };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestUserInfo: (userId) => dispatch(requestUserInfo(userId))
    }
}

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(UserAvatar as any)