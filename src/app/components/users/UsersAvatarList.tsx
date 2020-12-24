import * as React from 'react';
import { Avatar } from "antd";
import UserAvatar from './UserAvatar';


interface UserAvatarListProps {
    userIds: number[];
    maxCount?: number;
    hideDisplayName?: boolean;
}

export default class UserAvatarList extends React.Component<UserAvatarListProps> {
    render() {
        return <Avatar.Group maxCount={this.props.maxCount}>
            {
                this.props.userIds && <>{this.props.userIds.map((userId: number) => <UserAvatar key={userId} userId={userId}></UserAvatar>)}</>
            }
        </Avatar.Group>;
    }
}