import * as React from 'react';
import { Avatar, Popconfirm } from "antd";
import UserAvatar from './UserAvatar';
import SelectUser from 'app/components/users/selectusers';

interface UserAvatarListProps {
    userIds: number[];
    maxCount?: number;
    canEdit?: boolean;
    onUserSelected?: (userId: number) => void;
    onUserDeleted?: (userId: number) => void;
}


interface State {
    addUserClicked: boolean;
}

export default class UserAvatarList extends React.Component<UserAvatarListProps, State> {

    constructor(props: UserAvatarListProps) {
        super(props);
        this.state = {
            addUserClicked: false
        };

    }

    onAddClick() {
        this.setState({ addUserClicked: true })
    }

    onUserSelect(userId: number) {
        this.setState({ addUserClicked: false });
        if (this.props.onUserSelected) {
            this.props.onUserSelected(userId);
        }
    }

    onUserDeleted(userId: number) {
        if (this.props.onUserDeleted) {
            this.props.onUserDeleted(userId);
        }
    }
    render() {
        return <Avatar.Group maxCount={this.props.maxCount}>
            {
                this.props.userIds &&
                <>
                    {this.props.userIds.map((userId: number) =>
                        this.props.canEdit ?
                            <Popconfirm key={userId} onConfirm={this.onUserDeleted.bind(this, userId)} title="Are you sure?">
                                <UserAvatar userId={userId}></UserAvatar>&nbsp;
                            </Popconfirm>
                            :
                            <UserAvatar key={userId} userId={userId}></UserAvatar>
                    )
                    }
                    {(this.props.canEdit && !this.state.addUserClicked) &&
                        <span onClick={this.onAddClick.bind(this)}>
                            <Avatar src="/images/useravatar.png"></Avatar>
                        </span>
                    }
                    {this.state.addUserClicked && <SelectUser autoFocus={true} editMode={true} onSelect={this.onUserSelect.bind(this)}></SelectUser>}
                </>
            }
        </Avatar.Group>;
    }
}