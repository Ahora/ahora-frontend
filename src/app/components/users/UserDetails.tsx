import * as React from 'react';
import { UserItem } from 'app/services/users';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { requestUserInfo } from 'app/store/users/actions';
import { FormattedMessage } from 'react-intl';
import AhoraSpinner from '../Forms/Basics/Spinner';

interface InjectableProps {
    user?: UserItem;
}

interface UserDetailsProps extends InjectableProps, DispatchProps {
    userId: number | string | null;
    hideDisplayName?: boolean;
}

interface DispatchProps {
    requestUserInfo(userId: number): void;
}

class UserDetails extends React.Component<UserDetailsProps> {

    componentDidMount() {
        if (this.props.userId && !this.props.user) {
            const userId = parseInt(this.props.userId.toString());
            if (!isNaN(userId)) {
                this.props.requestUserInfo(userId);
            }
        }
    }

    render() {
        if (this.props.userId === null && this.props.user === undefined) {
            return <FormattedMessage id="unassigned" />;
        }
        else {
            const userInfo = this.props.user;
            if (userInfo) {
                return <>{userInfo && <>{userInfo.username}{(this.props.hideDisplayName !== true && userInfo.displayName) && <> ({userInfo.displayName})</>}</>}</>

            }
            else {
                return <AhoraSpinner />
            }
        }
    }
}


const mapStateToProps = (state: ApplicationState, props: UserDetailsProps): InjectableProps => {

    let user = props.user;
    if (props.userId !== null && props.userId !== undefined) {
        const realNumber = parseInt(props.userId.toString());

        if (!user && props.userId === "me") {
            user = state.currentUser.user;
        }
        else if (!isNaN(realNumber)) {
            user = state.users.map.get(realNumber);
        }
    }


    return { user };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestUserInfo: (userId) => dispatch(requestUserInfo(userId))
    }
}

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(UserDetails as any)