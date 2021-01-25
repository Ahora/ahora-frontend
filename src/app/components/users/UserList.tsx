import * as React from 'react';
import { Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { UserItem } from 'app/services/users';
import SelectUser from './selectusers';
import UserDetails from './UserDetails';

interface UsersListState {
    isDropDownOpened: boolean;
    selectedUsers: number[];
}

interface LabelsSelectorProps {
    selectedUsers?: number[];
    onChange(labels: number[]): void;
    canEdit?: boolean;
}

export default class UserList extends React.Component<LabelsSelectorProps, UsersListState> {
    constructor(props: LabelsSelectorProps) {
        super(props);
        this.state = {
            isDropDownOpened: false,
            selectedUsers: []
        };

    }

    componentDidMount() {
        if (this.props.selectedUsers) {
            this.setState({ selectedUsers: this.props.selectedUsers });
        }
    }

    componentDidUpdate(prevProps: LabelsSelectorProps) {
        if (prevProps.selectedUsers != this.props.selectedUsers && this.props.selectedUsers) {
            this.setState({ selectedUsers: this.props.selectedUsers });
        }
    }

    onClose(userId: number) {
        if (this.state.selectedUsers) {
            const userIds = this.state.selectedUsers.filter((currentUserId) => currentUserId !== userId);
            this.props.onChange(userIds);
            this.setState({ selectedUsers: userIds });
        }
    }

    onUserAdded(userId?: number) {
        if (userId) {
            const selectedUsers = [...this.state.selectedUsers, userId];
            this.props.onChange(selectedUsers);
            this.setState({
                selectedUsers
            });
        }

    }

    openDropDown() {
        this.setState({ isDropDownOpened: true });
    }

    render() {
        return (
            <>
                {this.props.canEdit}
                {this.state.selectedUsers.map((userId: number) => {
                    return <Tag onClose={this.onClose.bind(this, userId)} closable={this.props.canEdit} key={userId}><UserDetails userId={userId}></UserDetails></Tag>;
                })}
                {this.props.canEdit &&
                    <>

                        <div style={{ display: this.state.isDropDownOpened ? "inline-block" : "none" }}>
                            <SelectUser editMode={true} onSelect={this.onUserAdded.bind(this)}></SelectUser>
                        </div>
                        {!this.state.isDropDownOpened &&
                            <Tag className="site-tag-plus" onClick={this.openDropDown.bind(this)}>
                                <PlusOutlined /> Add User
                            </Tag>
                        }
                    </>
                }
            </>
        );
    }
}