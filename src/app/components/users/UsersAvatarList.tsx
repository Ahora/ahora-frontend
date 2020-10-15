import * as React from 'react';
import { Avatar } from "antd";
import UserAvatar from './UserAvatar';


interface UserAvatarListProps {
    userIds: number[];
    hideDisplayName?: boolean;
}

export default class UserAvatarList extends React.Component<UserAvatarListProps> {
    render() {
        return <div style={{ marginTop: "5px" }}>
            <Avatar.Group maxCount={5}>
                {
                    this.props.userIds && <>{this.props.userIds.map((userId: number) => <UserAvatar key={userId} userId={userId}></UserAvatar>)}</>
                }
            </Avatar.Group>
        </div>;
    }
}