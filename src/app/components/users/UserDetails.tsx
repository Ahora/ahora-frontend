import * as React from 'react';
import { UserItem } from 'app/services/users';

interface UserDetailsProps {
    user?: UserItem;
}

export default class UserDetails extends React.Component<UserDetailsProps> {
    render() {
        return <>{this.props.user && <>{this.props.user.username}{this.props.user.displayName && <> ({this.props.user.displayName})</>}</>}</>
    }
}